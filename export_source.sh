#!/bin/bash
#
# export_context.sh
#
# A utility script to output your project’s context in a format that’s easy to
# paste into an LLM chat window (e.g. ChatGPT, Claude, etc.).
#
# Options:
#   -s, --structure           Print the project structure (a tree view).
#   -f, --file <filepath>     Print the content of the specified file.
#   -d, --dir <directory>     Print the content of all files in the specified directory (recursively).
#   -l, --list <directory>    List file paths in the specified directory (recursively).
#   -h, --help                Display this help message.
#
# Example usage:
#   # To print the project tree:
#   ./export_context.sh --structure
#
#   # To output a single file:
#   ./export_context.sh --file client/src/App.jsx
#
#   # To output all .jsx files (or any files) in a directory:
#   ./export_context.sh --dir client/src
#
#   # To list all files in a directory:
#   ./export_context.sh --list client/src
#

# --- Helper Functions ---

# Print usage instructions.
print_usage() {
    cat <<EOF
Usage: $0 [options]

Options:
  -s, --structure            Print the project structure (tree view).
  -f, --file <filepath>      Print the content of the specified file.
  -d, --dir <directory>      Print the content of all files in the specified directory (recursively).
  -l, --list <directory>     List file paths in the specified directory (recursively).
  -h, --help                 Display this help message.
EOF
}

# Given a filename, return a language annotation based on its extension.
get_language_annotation() {
    local filename="$1"
    case "$filename" in
        *.js)    echo "javascript" ;;
        *.jsx)   echo "javascript" ;;
        *.ts)    echo "typescript" ;;
        *.tsx)   echo "typescript" ;;
        *.py)    echo "python" ;;
        *.java)  echo "java" ;;
        *.sh)    echo "bash" ;;
        *.md)    echo "markdown" ;;
        *.json)  echo "json" ;;
        *.html)  echo "html" ;;
        *.css)   echo "css" ;;
        *)       echo "" ;;
    esac
}

# Print a single file’s content with clear delimiters.
print_file() {
    local file="$1"
    if [ ! -f "$file" ]; then
        echo "File not found: $file" >&2
        return
    fi
    local lang
    lang=$(get_language_annotation "$file")
    echo "----- File: ${file} -----"
    if [ -n "$lang" ]; then
        echo '```'"$lang"
    else
        echo '```'
    fi
    cat "$file"
    echo '```'
    echo "----- End of ${file} -----"
    echo ""
}

# Print the contents of all files in a directory (recursively).
print_dir() {
    local dir="$1"
    if [ ! -d "$dir" ]; then
        echo "Directory not found: $dir" >&2
        return
    fi
    # Find and sort files (adjust the find pattern if needed)
    while IFS= read -r file; do
        print_file "$file"
    done < <(find "$dir" -type f | sort)
}

# List the files (paths) in a directory (recursively).
list_files() {
    local dir="$1"
    if [ ! -d "$dir" ]; then
        echo "Directory not found: $dir" >&2
        return
    fi
    echo "Files in $dir:"
    find "$dir" -type f | sort
    echo ""
}

# Print the project structure.
print_structure() {
    echo "Project Structure:"
    if command -v tree >/dev/null 2>&1; then
        # Use tree if available.
        tree -a
    else
        # Fallback: use find to simulate a tree.
        find . -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g'
    fi
    echo ""
}

# --- Main Script ---

# Initialize variables for options.
structureFlag=0
declare -a files
declare -a dirs
declare -a lists

# If no arguments, show help.
if [ "$#" -eq 0 ]; then
    print_usage
    exit 0
fi

# Parse arguments.
while [[ "$#" -gt 0 ]]; do
    case "$1" in
        -s|--structure)
            structureFlag=1
            ;;
        -f|--file)
            if [ -n "$2" ]; then
                files+=("$2")
                shift
            else
                echo "Error: --file requires a filepath argument." >&2
                exit 1
            fi
            ;;
        -d|--dir)
            if [ -n "$2" ]; then
                dirs+=("$2")
                shift
            else
                echo "Error: --dir requires a directory argument." >&2
                exit 1
            fi
            ;;
        -l|--list)
            if [ -n "$2" ]; then
                lists+=("$2")
                shift
            else
                echo "Error: --list requires a directory argument." >&2
                exit 1
            fi
            ;;
        -h|--help)
            print_usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            print_usage
            exit 1
            ;;
    esac
    shift
done

# Execute the requested options.
if [ "$structureFlag" -eq 1 ]; then
    print_structure
fi

for f in "${files[@]}"; do
    print_file "$f"
done

for d in "${dirs[@]}"; do
    print_dir "$d"
done

for l in "${lists[@]}"; do
    list_files "$l"
done
