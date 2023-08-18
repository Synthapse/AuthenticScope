import pandas as pd

def get_voice_id(accent=None, age=None, gender=None, description=None, use_cases=None):
    df = matched_voices(accent, age, gender, description, use_cases)
    if not df.empty:
        return df['voice_id'].values[0]
    elif description!=None:
        print(matched_voices(description=description))
        return matched_voices(description=description)['voice_id'].values[0]
    elif accent!=None:
        return matched_voices(accent=accent)['voice_id'].values[0]
    else:
        return '21m00Tcm4TlvDq8ikWAM' #Rachel



def matched_voices(accent=None, age=None, gender=None, description=None, use_cases=None):
    df = pd.read_csv('utils/voices_id.csv')
    filter_conditions = [True] * len(df)
    if accent is not None:
        filter_conditions &= (df['accent'] == accent.lower())
    if age is not None:
        filter_conditions &= (df['age'] == age.lower())
    if gender is not None:
        filter_conditions &= (df['gender'] == gender.lower())
    if description is not None:
        filter_conditions &= (df['description'] == description.lower())
    if use_cases is not None:
        filter_conditions &= (df['use_case'] == use_cases.lower())

    return df[filter_conditions]


