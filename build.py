import argparse
import pathlib
import re
import sys


ROOT = pathlib.Path(__file__).resolve().parent
HEADER_PATH = ROOT / "userscript-header.txt"
RUNTIME_PATH = ROOT / "FusionToolBox.runtime.js"
DEFAULT_OUTPUT_PATH = ROOT / "FusionToolBox.user.js"
REQUIRED_META_KEYS = ("@name", "@namespace", "@version", "@description")
SEMVER_PATTERN = re.compile(r"^(\d+)\.(\d+)\.(\d+)$")


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
        if "const FUSION_TOOLBOX_VERSION =" not in line:
            continue
        indent = line[: len(line) - len(line.lstrip())]
        lines[index] = f"{indent}const FUSION_TOOLBOX_VERSION = '{version}';"
        return "\n".join(lines)

    raise ValueError("FusionToolBox.runtime.js 中未找到 FUSION_TOOLBOX_VERSION")


def build_output(header: str, runtime: str) -> str:
    return (
        f"{header.rstrip()}\n\n"
        "// Built from FusionToolBox.runtime.js via build.py.\n"
        f"{runtime.lstrip().rstrip()}\n"
    )


def parse_semver(version: str) -> tuple[int, int, int]:
    match = SEMVER_PATTERN.fullmatch(version)
    if not match:
        raise ValueError(f"当前版本不是 x.y.z 格式，无法自动递增：{version}")
    return tuple(int(part) for part in match.groups())


def bump_version(version: str, bump_type: str) -> str:
    major, minor, patch = parse_semver(version)

    if bump_type == "patch":
        return f"{major}.{minor}.{patch + 1}"
    if bump_type == "minor":
        return f"{major}.{minor + 1}.0"
    if bump_type == "major":
        return f"{major + 1}.0.0"

    raise ValueError(f"不支持的版本递增类型：{bump_type}")


def prompt_choice(prompt: str, valid_choices: set[str]) -> str:
    while True:
        value = input(prompt).strip().lower()
        if value in valid_choices:
            return value
        display_choices = [choice if choice else "Enter" for choice in sorted(valid_choices)]
        print(f"请输入以下选项之一：{', '.join(display_choices)}")


def prompt_for_version(current_version: str) -> str | None:
    print(f"当前版本：{current_version}")
    should_bump = prompt_choice("是否升级版本号？[Y/n]: ", {"", "y", "n"})

    if should_bump not in {"", "y"}:
        return None

    try:
        next_version = bump_version(current_version, "patch")
    except ValueError:
        raise ValueError(
            f"当前版本 {current_version} 不是 x.y.z 格式，无法自动加版本号，请改用 --version 手工指定。"
        )

    print(f"版本号将自动升级到：{next_version}")
    return next_version


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

    current_version = extract_version(header)

    if not args.version and not args.check and sys.stdin.isatty():
        selected_version = prompt_for_version(current_version)
        if selected_version:
            args.version = selected_version

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
    print("Next: paste the built file into https://greasyfork.org/zh-CN/script_versions/new")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValueError as error:
        print(f"Build failed: {error}", file=sys.stderr)
        raise SystemExit(1)
