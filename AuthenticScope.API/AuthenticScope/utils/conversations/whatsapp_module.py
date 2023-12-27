def whatsapp_chat_to_list(chat):
    chat_list = []
    if chat[:1]=='[':
        chat = convert_chat_format(chat)

    current_sender = None
    current_message = ""
    for line in chat.split('\n'):
        if line.count(' - ') > 1:
            first_occurrence_index = line.find(' - ')

            if first_occurrence_index != -1:
                # Replace all subsequent occurrences with ' -- '
                line = line[:first_occurrence_index + 3] + line[first_occurrence_index + 3:].replace(' - ', ' -- ')
        
        parts = line.strip().split(' - ')
        if len(parts) >= 2:
            timestamp, message = parts
            sender, text = message.split(': ', 1)

            if sender == current_sender or current_sender is None:
                # This message is from the same sender as the previous message
                current_sender = sender
                if text != "<Media omitted>":
                    if len(current_message) != 0:
                        current_message += ". " + text
                    else:
                        current_message += " " + text
            else:
                # This is a message from a new sender, so we append the previous message
                chat_list.append(current_message.strip())
                current_sender = sender
                current_message = text if text != "<Media omitted>" else ""

            # Append the last message after the loop ends
    if current_sender:
        chat_list.append(current_message.strip())

    return chat_list


def whatsapp_chatfile_to_list(file_path):
    chat_list = []
    flag = False
    with open(file_path, 'r') as file:
        content = file.read()
        if content[:1] == '[':
            flag = True
        if flag:
            content = convert_chat_format(content)

        current_sender = None
        current_message = ""
        
        for line in content.split('\n'):
            if line.count(' - ') > 1:
                first_occurrence_index = line.find(' - ')

                if first_occurrence_index != -1:
                    # Replace all subsequent occurrences with ' -- '
                    line = line[:first_occurrence_index + 3] + line[first_occurrence_index + 3:].replace(' - ', ' -- ')
            
            parts = line.strip().split(' - ')
            if len(parts) >= 2:
                timestamp, message = parts
                sender, text = message.split(': ', 1)

                if sender == current_sender or current_sender is None:
                    # This message is from the same sender as the previous message
                    current_sender = sender
                    if text != "<Media omitted>":
                        if len(current_message) != 0:
                            current_message += ". " + text
                        else:
                            current_message += " " + text
                else:
                    # This is a message from a new sender, so we append the previous message
                    chat_list.append(current_message.strip())
                    current_sender = sender
                    current_message = text if text != "<Media omitted>" else ""

        # Append the last message after the loop ends
        if current_sender:
            chat_list.append(current_message.strip())

    return chat_list

def append_audio_to_mpeg(existing_file_path, audio_bytes_io):
    with open(existing_file_path, "rb") as existing_file:
        existing_data = existing_file.read()

    audio_bytes_io.seek(0)
    new_data = audio_bytes_io.read()
    combined_data = existing_data + new_data

    with open(existing_file_path, "wb") as combined_file:
        combined_file.write(combined_data)


def convert_chat_format(input_chat):
    converted_chat = []

    for line in input_chat.split('\n'):
        parts = line.strip().split('] ')
        if len(parts) == 2:
            timestamp, message = parts
            timestamp = timestamp[1:]  # Remove the opening bracket
            timestamp_time, timestamp_date = timestamp.split(', ')
            timestamp_date = timestamp_date[:-4]+ timestamp_date[-2:]
            sender_end = message.find(': ')
            sender_name = message[:sender_end]
            message_text = message[sender_end + 2:]
            if ' - ' in str(message_text):
                message_text = message_text.replace(' - ', ' -- ')

            converted_chat.append(f"{timestamp_date}, {timestamp_time} - {sender_name}: {message_text}")

    return '\n'.join(converted_chat)
