import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const CustomModal = ({ visible, onClose, title, children, footer }: CustomModalProps) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <TouchableWithoutFeedback>
            <View className="bg-white w-full rounded-3xl overflow-hidden shadow-2xl">
              {/* Header */}
              <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
                <Text className="text-xl font-bold text-gray-800">{title || 'Modal'}</Text>
                <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
                  <Text className="text-gray-500 font-bold">✕</Text>
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View className="p-6">
                {children}
              </View>

              {/* Footer */}
              {footer && (
                <View className="p-6 bg-gray-50 border-t border-gray-100">
                  {footer}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};