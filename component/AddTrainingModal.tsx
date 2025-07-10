import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { colors } from './theme';
import { FontAwesome5 } from '@expo/vector-icons';

interface AddTrainingModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddTrainingModal({ visible, onClose }: AddTrainingModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: '#0009', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: colors.accent, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600' }}>Add Training</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome5 name="times" size={20} color={colors.gray400} />
            </TouchableOpacity>
          </View>
          {/* Dummy form fields */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.gray400, fontSize: 13, marginBottom: 6 }}>Exercise Name</Text>
            <View style={{ backgroundColor: colors.secondary + '88', borderRadius: 8, padding: 10 }}>
              <Text style={{ color: colors.gray400 }}>Enter exercise name</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.gray400, fontSize: 13, marginBottom: 6 }}>Sets</Text>
              <View style={{ backgroundColor: colors.secondary + '88', borderRadius: 8, padding: 10 }}>
                <Text style={{ color: colors.gray400 }}>3</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.gray400, fontSize: 13, marginBottom: 6 }}>Reps</Text>
              <View style={{ backgroundColor: colors.secondary + '88', borderRadius: 8, padding: 10 }}>
                <Text style={{ color: colors.gray400 }}>8-12</Text>
              </View>
            </View>
          </View>
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: colors.gray400, fontSize: 13, marginBottom: 6 }}>Category</Text>
            <View style={{ backgroundColor: colors.secondary + '88', borderRadius: 8, padding: 10 }}>
              <Text style={{ color: colors.gray400 }}>Chest</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={onClose} style={{ flex: 1, backgroundColor: colors.secondary + '88', borderRadius: 10, paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ color: colors.gray400, fontSize: 15, fontWeight: '500' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ color: colors.white, fontSize: 15, fontWeight: '500' }}>Add Exercise</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
} 