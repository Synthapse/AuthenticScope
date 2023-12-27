import ai21
def api_call(model,prompt,maxTokens,minTokens):
    with open (f"{model}-output.txt", 'a') as j2_file:
        j2_file.write(f"Prompt: \n {prompt}")
        j2_file.write("\nOutput: \n ")
        output = ai21.Completion.execute(   model = model, 
                                            prompt = prompt,
                                            maxTokens = maxTokens,
                                            minTokens = minTokens
                                            ).__dict__
        output_str = output['completions'][0]['data']['text']
        print(output_str)
        j2_file.write(output_str[1:])
        j2_file.write(f"\n(Tokens: {len(output_str[2:].split())})(minTokens: {minTokens}),(maxTokens: {maxTokens}) \
                        \n-------\n")
        j2_file.close()
    return output_str[1:]