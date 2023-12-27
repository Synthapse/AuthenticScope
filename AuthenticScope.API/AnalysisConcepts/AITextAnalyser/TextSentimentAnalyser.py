from pysentimiento import create_analyzer
import pandas as pd

def create_emotions_features(texts, analyzer):

    emotions_list = []

    for i, text in enumerate(texts):
        emotions_list.append(analyzer.predict(text).probas)
        emotions_list[i]['text'] = text

    return emotions_list


def emotional_direction(emotions_dataframe, joy_weight, sadness_weight, anger_weight, disgust_weight, surprise_weight=0,
                        fear_weight=0, others_weight=0):

    return emotions_dataframe["joy"] * joy_weight + \
        emotions_dataframe["sadness"] * sadness_weight + \
        emotions_dataframe["anger"] * anger_weight + \
        emotions_dataframe["disgust"] * disgust_weight + \
        emotions_dataframe["surprise"] * surprise_weight + \
        emotions_dataframe["fear"] * fear_weight + \
        emotions_dataframe["others"] * others_weight


def start_emotion_analyser(texts):


    analyzer = create_analyzer(task="emotion", lang="en")

    try:
        emotions = create_emotions_features(texts, analyzer)
        emotions_df = pd.DataFrame(emotions)

        emotions_direction_df = pd.DataFrame(emotional_direction(pd.DataFrame(emotions),
                                                                 joy_weight=10,
                                                                 sadness_weight=-1,
                                                                 anger_weight=-10,
                                                                 disgust_weight=-10,
                                                                 surprise_weight=0,
                                                                 fear_weight=0,
                                                                 others_weight=0), columns=["intensity"])

        emotions_intensity_df = pd.concat([emotions_df, emotions_direction_df], axis=1)

        return emotions_intensity_df

    except Exception as e:
        print("Error occured. %s" % e)


t1 = ["Walking on the beach, I felt blessed by the beautiful scenery and the gentle sun. The ocean's waves brought me joy and a deep sense of contentment.", "second text"]
t1_more_anger = ["Fury consumed me as I trudged along the beach, cursing the wretched scenery and scorching sun. The relentless assault of the ocean's waves ignited a burning rage within me, intensifying my deep sense of resentment and indignation"]
t1_more_joy = ["Walking on the beach, I was filled with pure joy, embracing the beautiful scenery and the warmth of the sun. The rhythmic waves of the ocean brought me deep contentment, creating a moment of pure bliss."]

anger = start_emotion_analyser(t1)
print(anger) #anger - 0.001872
more_anger = start_emotion_analyser(t1_more_anger)
print(more_anger) #anger 0.004826

joy = start_emotion_analyser(t1)
print(joy) #joy - 0.978546
more_joy = start_emotion_analyser(t1_more_joy)
print(more_joy) #joy 0.978263