import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import {Note} from '../../lib/api';
import Icon from 'react-native-vector-icons/AntDesign';
import colors from '../../styles/colors';

interface Props {
  note: Note;
  username: string;
  onDelete: () => void;
  onEdit: (editedContent: string) => void 
}

export default function NoteCard({note, username, onDelete, onEdit}: Props) {

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSavePress = () => {
    onEdit(editedContent); // Call the onEdit prop with the edited content
    setIsEditing(false);
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
        ) : <Text style={styles.contentText}>{note.content}</Text>}
        <View style={styles.footer}>
          {isEditing ? (
            <TouchableOpacity onPress={handleSavePress}>
              <Icon name='save' size={24} color={colors.btnColor}></Icon>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleEditPress}>
            <Icon name='edit' size={24} color={colors.btnColor}></Icon>
          </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Icon name='delete' size={24} color={colors.red}></Icon>
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
  deleteButton: {
    flex: 1,
    marginHorizontal: 20,
    alignItems: 'flex-end'
  }
});
