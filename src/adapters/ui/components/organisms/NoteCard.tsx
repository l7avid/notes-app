/* eslint-disable prettier/prettier */
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
import { Note } from '../../../../lib/api';
import colors from '../../../../styles/colors';

interface Props {
  note: Note;
  username: string;
  onDelete: () => void;
  onEdit: (editedContent: string) => void;
  onShare: () => Promise<void>;
  showIcon: boolean;
}

export default function NoteCard({
  note,
  username,
  onDelete,
  onEdit,
  onShare,
  showIcon,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSavePress = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };

  const handleSharePress = async () => {
    await onShare();
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
            placeholder="Edit note"
          />
        ) : (
          <Text style={styles.contentText}>{note.content}</Text>
        )}
        <View style={styles.footer}>
          {showIcon &&
            (isEditing ? (
              <TouchableOpacity onPress={handleSavePress} testID='save-button'>
                <Icon name="save" size={24} color={colors.btnColor} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleEditPress} testID='edit-button'>
                <Icon name="edit" size={24} color={colors.btnColor} />
              </TouchableOpacity>
            ))}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleSharePress}
            testID="share-button">
            <Share name="share" size={24} color={colors.btnColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete} testID="delete-button">
            <Icon name="delete" size={24} color={colors.red} />
          </TouchableOpacity>
        </View>
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
