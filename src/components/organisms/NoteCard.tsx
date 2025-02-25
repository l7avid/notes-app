import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Note} from '../../lib/api';
import Icon from 'react-native-vector-icons/AntDesign';
import colors from '../../styles/colors';

interface Props {
  note: Note;
}

export default function NoteCard({note}: Props) {

  const navIcon = Icon.getImageSourceSync('md-arrow-back', 24, 'white');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>User</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>{note.content}</Text>
        <View style={styles.footer}>
          <TouchableOpacity>
            <Icon name='delete' size={24} color={colors.deleteColor}></Icon>
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
    paddingTop: 8,
  },
});
