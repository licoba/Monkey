import argparse
import pathlib
import re
import sys


ROOT = pathlib.Path(__file__).resolve().parent
HEADER_PATH = ROOT / "userscript-header.txt"
RUNTIME_PATH = ROOT / "toolbox-runtime.js"
DEFAULT_OUTPUT_PATH = ROOT / "my-toolbox.user.js"
REQUIRED_META_KEYS = ("@name", "@namespace", "@version", "@description")


def read_text(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8").replace("\r\n", "\n")


def write_text(path: pathlib.Path, content: str) -> None:
    path.write_text(content, encoding="utf-8", newline="\n")


def extract_version(header: str) -> str:
    match = re.search(r"^// @version\s+(.+)$", header, re.MULTILINE)
    if not match:
        raise ValueError("userscript-header.txt 缺少 @version")
    return match.group(1).strip()


def extract_name(header: str) -> str:
    match = re.search(r"^// @name\s+(.+)$", header, re.MULTILINE)
    if not match:
        raise ValueError("userscript-header.txt 缺少 @name")
    return match.group(1).strip()


def validate_header(header: str) -> None:
    for key in REQUIRED_META_KEYS:
        if key not in header:
            raise ValueError(f"userscript-header.txt 缺少 {key}")

    if "// ==UserScript==" not in header or "// ==/UserScript==" not in header:
        raise ValueError("userscript-header.txt 缺少完整的 Userscript 头")


def replace_header_version(header: str, version: str) -> str:
    return re.sub(
        r"^// @version\s+.+$",
        f"// @version      {version}",
        header,
        count=1,
        flags=re.MULTILINE,
    )


def sync_runtime_version(runtime: str, version: str) -> str:
    lines = runtime.splitlines()

    for index, line in enumerate(lines):
        if "const TOOLBOX_VERSION =" not in line:
            continue
        indent = line[: len(line) - len(line.lstrip())]
        lines[index] = f"{indent}const TOOLBOX_VERSION = '{version}';"
        return "\n".join(lines)

    raise ValueError("toolbox-runtime.js 中未找到 TOOLBOX_VERSION")


def build_output(header: str, runtime: str) -> str:
    return (
        f"{header.rstrip()}\n\n"
        "// Built from toolbox-runtime.js via build.py.\n"
        f"{runtime.lstrip().rstrip()}\n"
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build the FusionToolBox release userscript."
    )
    parser.add_argument(
        "--version",
        help="Override the release version and write it back to userscript-header.txt.",
    )
    parser.add_argument(
        "--output",
        default=str(DEFAULT_OUTPUT_PATH),
        help="Output path for the built userscript.",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Validate metadata and preview the build without writing files.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    header = read_text(HEADER_PATH)
    runtime = read_text(RUNTIME_PATH)

    validate_header(header)

    if args.version:
        header = replace_header_version(header, args.version)
        write_text(HEADER_PATH, header)

    version = extract_version(header)
    runtime = sync_runtime_version(runtime, version)
    output = build_output(header, runtime)
    output_path = pathlib.Path(args.output).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if args.check:
        print("Check passed.")
        print(f"Name: {extract_name(header)}")
        print(f"Version: {version}")
        print(f"Output: {output_path}")
        return 0

    write_text(output_path, output)

    print("Build completed.")
    print(f"Script: FusionToolBox")
    print(f"Version: {version}")
    print(f"Output: {output_path}")
    print("Next: paste the built file into https://greasyfork.org/zh-CN/scripts/new")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValueError as error:
        print(f"Build failed: {error}", file=sys.stderr)
        raise SystemExit(1)
