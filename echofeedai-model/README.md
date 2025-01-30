cd echofeedai-model

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 main.py
```

### Run the model

```bash
uvicorn app:app --reload
```

### TODO

- [ ] Add swagger protection
