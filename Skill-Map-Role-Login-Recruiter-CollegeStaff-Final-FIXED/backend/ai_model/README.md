# Skill Map Local Trained AI

This folder contains a small, locally runnable **trained intent model** for the Skill Map career assistant.

- Training method: TF-IDF features + Logistic Regression
- Training examples: 105 synthetic career-assistant examples
- Intents: 15 career intents
- Artifact: `model.json`
- Source data: `training_dataset.jsonl`
- Retrain: `python train_model.py`

This is not a generative LLM. It is a lightweight trained intent model used to classify the user's question and generate profile-aware career guidance locally. Gemini remains the higher-quality generative provider when `GEMINI_API_KEY` is configured.
