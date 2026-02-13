import Swal from 'sweetalert2';
import { Platform, Alert } from 'react-native';

const isWeb = Platform.OS === 'web';

const Toast = isWeb ? Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
}) : null;

export const showToast = (icon, title) => {
  if (isWeb) {
    Toast.fire({
      icon,
      title
    });
  } else {
    // Fallback for native mobile
    alert(`${icon.toUpperCase()}: ${title}`);
  }
};

export const showConfirm = async (title, text, confirmButtonText = 'Confirm') => {
  if (isWeb) {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText
    });
    return result.isConfirmed;
  } else {
    // Native Alert with Promise
    return new Promise((resolve) => {
      Alert.alert(
        title,
        text,
        [
          { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
          { text: confirmButtonText, onPress: () => resolve(true), style: 'destructive' },
        ],
        { cancelable: true }
      );
    });
  }
};