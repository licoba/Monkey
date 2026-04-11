import pathlib
import shutil
import subprocess
import sys
from typing import Optional


ROOT = pathlib.Path(__file__).resolve().parent
BASE_URL = "http://127.0.0.1:8123"
DEBUG_TARGET = "https://www.meiguodizhi.com/"


def print_banner() -> None:
    print("=" * 56)
    print(" FusionToolBox Dev Server")
    print("=" * 56)
    print(f"[INFO] Root          : {ROOT}")
    print("[INFO] Keep this window open while developing.")
    print(f"[INFO] Install loader: {BASE_URL}/FusionToolBox.loader.user.js")
    print(f"[INFO] Debug target  : {DEBUG_TARGET}")
    print("=" * 56)


def resolve_node() -> Optional[str]:
    return shutil.which("node")


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
