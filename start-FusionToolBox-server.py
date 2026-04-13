import pathlib
import shutil
import subprocess
import sys
import time
from typing import Optional


ROOT = pathlib.Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = 8123
BASE_URL = "http://127.0.0.1:8123"


def print_banner() -> None:
    print("=" * 56)
    print(" FusionToolBox Dev Server")
    print("=" * 56)
    print(f"[INFO] Root          : {ROOT}")
    print("[INFO] Keep this window open while developing.")
    print(f"[INFO] Install loader: {BASE_URL}/FusionToolBox.loader.user.js")
    print("=" * 56)


def resolve_node() -> Optional[str]:
    return shutil.which("node")


def find_port_owner_pid() -> Optional[int]:
    try:
        completed = subprocess.run(
            ["netstat", "-ano", "-p", "tcp"],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )
    except OSError:
        return None

    if completed.returncode != 0:
        return None

    target = f"{HOST}:{PORT}"
    for line in completed.stdout.splitlines():
        parts = line.split()
        if len(parts) < 5:
            continue

        protocol, local_address, _foreign_address, state, pid = parts[:5]
        if protocol.upper() != "TCP":
            continue
        if local_address != target or state.upper() != "LISTENING":
            continue

        try:
            return int(pid)
        except ValueError:
            return None

    return None


def get_process_name(pid: int) -> Optional[str]:
    try:
        completed = subprocess.run(
            ["tasklist", "/FI", f"PID eq {pid}", "/FO", "CSV", "/NH"],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )
    except OSError:
        return None

    if completed.returncode != 0:
        return None

    line = completed.stdout.strip()
    if not line or line.startswith("INFO:"):
        return None

    if line.startswith('"'):
        return line.split('","', 1)[0].strip('"')

    return line.split(",", 1)[0].strip()


def wait_for_port_release(timeout_seconds: float = 5.0) -> bool:
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        if find_port_owner_pid() is None:
            return True
        time.sleep(0.2)
    return False


def stop_previous_server_if_needed() -> bool:
    pid = find_port_owner_pid()
    if pid is None:
        return True

    process_name = get_process_name(pid)
    if not process_name:
        print(f"[ERROR] Port {PORT} is already in use, but the process could not be identified.", file=sys.stderr)
        return False

    normalized_name = process_name.lower()
    if normalized_name not in {"node.exe", "node"}:
        print(
            f"[ERROR] Port {PORT} is already in use by {process_name} (PID {pid}).",
            file=sys.stderr,
        )
        return False

    print(f"[INFO] Port {PORT} is already in use by {process_name} (PID {pid}).")
    print("[INFO] Stopping previous dev-server.js process ...")

    try:
        completed = subprocess.run(
            ["taskkill", "/PID", str(pid), "/T", "/F"],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )
    except OSError as error:
        print(f"[ERROR] Failed to stop previous process: {error}", file=sys.stderr)
        return False

    if completed.returncode != 0:
        message = completed.stderr.strip() or completed.stdout.strip() or "unknown error"
        print(f"[ERROR] Failed to stop previous process: {message}", file=sys.stderr)
        return False

    if not wait_for_port_release():
        print(f"[ERROR] Port {PORT} is still occupied after stopping PID {pid}.", file=sys.stderr)
        return False

    print("[INFO] Previous dev server stopped.")
    return True


def main() -> int:
    print_banner()

    node_path = resolve_node()
    if not node_path:
        print("[ERROR] Node.js is required for start-FusionToolBox-server.py.", file=sys.stderr)
        return 1

    try:
        completed = subprocess.run(
            [node_path, "--version"],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )
    except OSError as error:
        print(f"[ERROR] Failed to check Node.js: {error}", file=sys.stderr)
        return 1

    if completed.returncode != 0:
        print("[ERROR] Node.js is required for start-FusionToolBox-server.py.", file=sys.stderr)
        return completed.returncode

    version = completed.stdout.strip() or completed.stderr.strip() or "unknown"
    print(f"[INFO] Node version  : {version}")
    if not stop_previous_server_if_needed():
        return 1
    print("[INFO] Starting dev-server.js ...")

    try:
        process = subprocess.run(
            [node_path, "dev-server.js"],
            cwd=ROOT,
            check=False,
        )
    except KeyboardInterrupt:
        print("\n[INFO] Dev server stopped by user.")
        return 130
    except OSError as error:
        print(f"[ERROR] Failed to start dev-server.js: {error}", file=sys.stderr)
        return 1

    return process.returncode


if __name__ == "__main__":
    raise SystemExit(main())
