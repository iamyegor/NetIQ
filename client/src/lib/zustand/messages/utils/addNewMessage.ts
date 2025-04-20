import Message from "@/types/chat/Message.ts";

export default function addNewMessage(messages: Message[], messageToAdd: Message) {
    const isMessageSelected = messageToAdd.isSelected;

    return [
        ...messages.map((message) => ({
            ...message,
            // If prev. messages with the same linkId are selected and messageToAdd should be selected,
            // then make all those prev. messages unselected
            isSelected:
                message.linkId === messageToAdd.linkId ? !isMessageSelected : message.isSelected,
        })),
        { ...messageToAdd },
    ];
}
