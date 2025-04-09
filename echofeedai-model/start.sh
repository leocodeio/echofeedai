# check if .venv exists
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    sudo apt-get update -y
    sudo apt-get install libreadline-dev -y
    curl -fsSL https://pyenv.run | bash
    pyenv install 3.12
    pyenv global 3.12
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
fi

source .venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8000 
# --workers 4


