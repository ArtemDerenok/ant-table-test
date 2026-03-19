import { useState, type FC, type ReactNode } from 'react';
import { Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ItemForm, { type FormValues } from '../ItemForm/ItemForm';

interface DataItem {
  id: number;
  name: string;
  date: string;
  value: number;
}

interface EditItemFormProps {
  item: DataItem;
  onEdit: (id: number, values: Omit<DataItem, 'id'>) => void;
  trigger?: ReactNode;
}

const EditItemForm: FC<EditItemFormProps> = ({ 
  item, 
  onEdit, 
  trigger 
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const hasDataChanged = (newValues: FormValues): boolean => {
    const originalDate = dayjs(item.date);
    const newDate = newValues.date;
    
    return (
      item.name !== newValues.name ||
      !originalDate.isSame(newDate, 'day') || 
      item.value !== newValues.value
    );
  };

  const handleSubmit = (values: FormValues) => {
  
    if (!hasDataChanged(values)) {
      message.info('Нет изменений в данных');
      setOpen(false); 
      return;
    }

    const updatedItem = {
      name: values.name,
      date: values.date.format('YYYY-MM-DD'),
      value: values.value,
    };
    
    onEdit(item.id, updatedItem);
    message.success('Запись успешно обновлена');
    setOpen(false);
  };

  const getInitialValues = (): FormValues => {
    return {
      name: item.name,
      date: dayjs(item.date),
      value: item.value,
    };
  };

  return (
    <>
      {trigger ? (
        <span onClick={handleOpen}>{trigger}</span>
      ) : (
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={handleOpen}
        />
      )}

      <ItemForm
        open={open}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        initialValues={getInitialValues()}
        title="Редактирование записи"
      />
    </>
  );
};

export default EditItemForm;
