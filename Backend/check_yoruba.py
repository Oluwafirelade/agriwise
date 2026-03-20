from deep_translator import GoogleTranslator

tests = [
    "Kí ni yíyi irúgbìn padà?",
    "Kí ni yíyi irúgbìn?",
    "Kí ni irugbin padà?",
    "Kí ni crop rotation?",
    "What is crop rotation?"
]

for t in tests:
    try:
        e = GoogleTranslator(source='yo', target='en').translate(t)
        print(repr(t), '=>', repr(e))
    except Exception as er:
        print('err', repr(t), er)
