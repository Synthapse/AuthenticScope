import ai21
import api_call as ac

ai21.api_key = ""       #paste your API key here

prompt = input('Tell me what should I do for you! : \n')


# model selection
num = 0
while(num > 0 and num < 4):
    num = int(input('Enter intergers as per model: \n\
                        1 J2-light \n\
                        2 J2-mid \n\
                        3 J2-ultra'))
    if num==1:   model='j2-light'
    elif num==2: model='j2-mid'
    elif num==3: model='j2-ultra'
    else: print('\nWrong model number, try agian!\n')


# minimum and maximum tokens for the model
maxTokens = 300
minTokens = 50

output = ac.api_call(model,prompt,maxTokens,minTokens)
print(output)
