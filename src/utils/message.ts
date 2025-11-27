import { ElMessage } from 'element-plus';

export const MESSAGES = {
  error: (val: string, msgTime: number, plain?: boolean) => {
    return ElMessage({
      message: val,
      type: 'error',
      duration: Math.ceil(val.length / msgTime) * 1000,
      plain: plain ?? true,
    });
  },
  success: (val: string, msgTime: number, plain?: boolean) => {
    return ElMessage({
      message: val,
      type: 'success',
      duration: Math.ceil(val.length / msgTime) * 1000,
      plain: plain ?? true,
    });
  },
  warning: (val: string, msgTime: number, plain?: boolean) => {
    return ElMessage({
      message: val,
      type: 'warning',
      duration: Math.ceil(val.length / msgTime) * 1000,
      plain: plain ?? true,
    });
  },
};
