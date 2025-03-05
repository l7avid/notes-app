import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-vector-icons/Feather';
import { Note } from '../../lib/api';
import colors from '../../styles/colors';
import { Profile } from '../../lib/fetchProfileById';

interface Props {
  note: Note;
  username: string;
  onDelete: () => void;
  onEdit: (editedContent: string) => void;
  onShare: () => Promise<Profile[]>;
}

export default function NoteCard({
  note,
  username,
  onDelete,
  onEdit,
  onShare,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [isShareListVisible, setIsShareListVisible] = useState(false);
  const [shareData, setShareData] = useState<Profile[]>([]);

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSavePress = () => {
    onEdit(editedContent); // Call the onEdit prop with the edited content
    setIsEditing(false);
  };

  const handleSharePress = async () => {
    const data = await onShare(); // Call the onShare function to get the data
    setShareData(data); // Set the share data
    setIsShareListVisible(!isShareListVisible); // Show the list
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.content}>
        {isEditing ? (
          <TextInput
            style={styles.contentText}
            value={editedContent}
            onChangeText={setEditedContent}
            multiline
            autoFocus
          />
        ) : (
          <Text style={styles.contentText}>{note.content}</Text>
        )}
        <View style={styles.footer}>
          {isEditing ? (
            <TouchableOpacity onPress={handleSavePress}>
              <Icon name="save" size={24} color={colors.btnColor}></Icon>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleEditPress}>
              <Icon name="edit" size={24} color={colors.btnColor}></Icon>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleSharePress}>
            <Share name="share" size={24} color={colors.btnColor}></Share>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Icon name="delete" size={24} color={colors.red}></Icon>
          </TouchableOpacity>
        </View>
        {isShareListVisible && (
          <View style={styles.shareList}>
            { shareData.length !== 0 &&
            shareData.map(item => (
              <TouchableOpacity key={item?.id} style={styles.shareListItem}>
                <Text>{item!.username}</Text>
              </TouchableOpacity> 
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  content: {
    padding: 16,
  },
  contentText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  shareButton: {
    marginLeft: 20,
  },
  deleteButton: {
    flex: 1,
    marginHorizontal: 20,
    alignItems: 'flex-end',
  },
  shareList: {
    marginTop: 10,
  },
  shareListItem: {
    fontSize: 14,
    paddingVertical: 5,
  },
});
