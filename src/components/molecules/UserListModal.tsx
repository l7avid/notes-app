import React from 'react';
import {
  Modal,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {Profile} from '../../lib/fetchProfileById';
import colors from '../../styles/colors';

interface UserListModalProps {
  visible: boolean;
  users: Profile[];
  onClose: () => void;
}

const UserListModal: React.FC<UserListModalProps> = ({
  visible,
  users,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FlatList
            data={users}
            keyExtractor={item => item!.id}
            renderItem={({item}) => (
              <View style={styles.userItem}>
                <TouchableOpacity>
                  <Text style={styles.userName}>
                    {item?.username || item?.full_name || 'Unknown User'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.themebackgroundcolor,
  },
  userName: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.btnColor,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default UserListModal;
