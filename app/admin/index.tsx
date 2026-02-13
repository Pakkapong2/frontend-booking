import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { getAllBooks, createBook, updateBook, deleteBook } from '../../services/book';
import { getAllBookTypes } from '../../services/bookType';
import { showToast, showConfirm } from '../../services/toast';
import { CustomModal } from '../../components/CustomModal';

export default function AdminInventoryScreen() {
  const [books, setBooks] = useState([]);
  const [bookTypes, setBookTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    book_type_id: '',
    status: 'available'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksData, typesData] = await Promise.all([
        getAllBooks(),
        getAllBookTypes()
      ]);
      setBooks(booksData);
      setBookTypes(typesData);
    } catch (error) {
      showToast('error', 'โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (book = null) => {
    if (book) {
      setSelectedBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        book_type_id: book.book_type_id?.toString() || '',
        status: book.status
      });
    } else {
      setSelectedBook(null);
      setFormData({ title: '', author: '', book_type_id: '', status: 'available' });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.author || !formData.book_type_id) {
      showToast('error', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    try {
      if (editingBook) {
        await updateBook(editingBook.book_id, formData);
        showToast('success', 'อัปเดตข้อมูลหนังสือสำเร็จ');
      } else {
        await createBook(formData);
        showToast('success', 'เพิ่มหนังสือใหม่สำเร็จ');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      showToast('error', 'บันทึกข้อมูลไม่สำเร็จ');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ว่าต้องการลบหนังสือเล่มนี้ออกจากระบบ?",
      "ลบ"
    );

    if (confirmed) {
      try {
        await deleteBook(id);
        showToast('success', 'ลบหนังสือสำเร็จ');
        fetchData();
      } catch (error) {
        showToast('error', 'ลบข้อมูลไม่สำเร็จ');
      }
    }
  };

  const renderBookItem = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
          <Text className="text-gray-500">ผู้แต่ง: {item.author}</Text>
          <Text className="text-blue-500 text-xs mt-1">
            หมวดหมู่: {item.BookType?.book_type_name || 'ทั่วไป'}
          </Text>
        </View>
        <View className="items-end">
          <View className={`px-2 py-1 rounded-md mb-2 ${
            item.status === 'available' ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <Text className={`text-[10px] font-bold ${
              item.status === 'available' ? 'text-green-700' : 'text-orange-700'
            }`}>
              {item.status === 'available' ? 'ว่าง' : 'ถูกยืม'}
            </Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity 
              className="bg-blue-100 p-2 rounded-lg mr-2"
              onPress={() => openModal(item)}>
              <Text className="text-blue-600 text-xs font-bold">แก้ไข</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-red-100 p-2 rounded-lg"
              onPress={() => handleDelete(item.book_id)}>
              <Text className="text-red-600 text-xs font-bold">ลบ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800">จัดการหนังสือ</Text>
        <TouchableOpacity 
          className="bg-blue-600 px-4 py-2 rounded-xl"
          onPress={() => openModal()}>
          <Text className="text-white font-bold">+ เพิ่มหนังสือ</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.book_id.toString()}
          renderItem={renderBookItem}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">ไม่พบข้อมูลหนังสือในระบบ</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingBook ? "แก้ไขข้อมูลหนังสือ" : "เพิ่มหนังสือใหม่"}
        footer={
          <View className="flex-row">
            <TouchableOpacity 
              className="flex-1 bg-gray-200 p-4 rounded-xl mr-2"
              onPress={() => setModalVisible(false)}>
              <Text className="text-gray-700 text-center font-bold">ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-blue-600 p-4 rounded-xl"
              onPress={handleSave}>
              <Text className="text-white text-center font-bold">บันทึก</Text>
            </TouchableOpacity>
          </View>
        }
      >
        <ScrollView>
          <View className="mb-4">
            <Text className="text-gray-600 mb-2 font-semibold">ชื่อหนังสือ</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
              placeholder="ระบุชื่อหนังสือ"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 mb-2 font-semibold">ชื่อผู้แต่ง</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
              placeholder="ระบุชื่อผู้แต่ง"
              value={formData.author}
              onChangeText={(text) => setFormData({ ...formData, author: text })}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 mb-2 font-semibold">ประเภทหนังสือ</Text>
            <View className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-2">
                {bookTypes.map((type) => (
                  <TouchableOpacity
                    key={type.book_type_id}
                    onPress={() => setFormData({ ...formData, book_type_id: type.book_type_id.toString() })}
                    className={`mr-2 px-4 py-2 rounded-lg ${
                      formData.book_type_id === type.book_type_id.toString() 
                      ? 'bg-blue-600' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <Text className={`${
                      formData.book_type_id === type.book_type_id.toString() 
                      ? 'text-white' : 'text-gray-600'
                    } font-semibold`}>
                      {type.book_type_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {editingBook && (
            <View className="mb-4">
              <Text className="text-gray-600 mb-2 font-semibold">สถานะ</Text>
              <View className="flex-row">
                {[
                  { id: 'available', label: 'ว่าง' },
                  { id: 'borrowed', label: 'ถูกยืม' }
                ].map((s, index) => (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => setFormData({ ...formData, status: s.id })}
                    className={`flex-1 p-3 rounded-xl border ${index === 0 ? 'mr-2' : ''} ${
                      formData.status === s.id 
                      ? 'bg-blue-50 border-blue-600' : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className={`text-center ${formData.status === s.id ? 'text-blue-600' : 'text-gray-500'} font-bold`}>
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </CustomModal>
    </View>
  );
}