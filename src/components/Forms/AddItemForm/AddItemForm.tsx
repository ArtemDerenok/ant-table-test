import { useState, type FC } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { FormValues } from '../ItemForm/ItemForm';
import ItemForm from '../ItemForm/ItemForm';

interface DataItem {
  id: number;
  name: string;
  date: string;
  value: number;
}

interface AddItemFormProps {
  onAdd: (item: DataItem) => void; 
}

const AddItemForm: FC<AddItemFormProps> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (values: FormValues) => {
    const newItem: DataItem = { 
      id: Date.now(),
      name: values.name,
      date: values.date.format('YYYY-MM-DD'),
      value: values.value,
    };
    
    onAdd(newItem);
    message.success('Запись успешно добавлена');
    setOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleOpen}
      >
        Добавить
      </Button>

      <ItemForm
        open={open}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        title="Добавление новой записи"
      />
    </>
  );
};

export default AddItemForm;
