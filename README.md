# Personalized-Learning-Platform


Ports
frontend: 3000
authentication:4000
cards: 5000
start: 6000
automation:7000



from transformers import AutoTokenizer, AutoModelForTokenClassification, TokenClassificationPipeline

tokenizer = AutoTokenizer.from_pretrained("path/to/your/fine-tuned-model")
model = AutoModelForTokenClassification.from_pretrained("path/to/your/fine-tuned-model")
ner_pipeline = TokenClassificationPipeline(model=model, tokenizer=tokenizer, aggregation_strategy="simple")
