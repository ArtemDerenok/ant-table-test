
import { useEffect, type FC } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber } from 'antd';
import dayjs from 'dayjs';
import { useDraggableModal } from "@shared/hooks/useDraggableModal";

export interface FormValues {
  name: string;
  date: dayjs.Dayjs;
  value: number;
}

interface ItemFormProps {
  open: boolean;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  initialValues?: FormValues;
  title: string;
}

const ItemForm: FC<ItemFormProps> = ({
  open,
  onSubmit,
  onCancel,
  initialValues,
  title,
}) => {
  const [form] = Form.useForm();
   const { DraggableModal, handleMouseOver, handleMouseOut } =
    useDraggableModal();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (open && !initialValues) {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
         title={
        <div
          style={{ width: '100%', cursor: 'move', fontWeight: 700 }}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {title}
        </div>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
       modalRender={(modal) => {
        return DraggableModal({ children: modal });
      }}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Имя"
          rules={[
            { required: true, message: 'Пожалуйста, введите имя' },
            { min: 2, message: 'Имя должно содержать минимум 2 символа' },
          ]}
        >
          <Input placeholder="Введите имя" />
        </Form.Item>

        <Form.Item
          name="date"
          label="Дата"
          rules={[
            { required: true, message: 'Пожалуйста, выберите дату' },
          ]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            format="DD.MM.YYYY"
            placeholder="Выберите дату"
          />
        </Form.Item>

        <Form.Item
          name="value"
          label="Числовое значение"
          rules={[
            { required: true, message: 'Пожалуйста, введите числовое значение' },
            { type: 'number', min: 0, message: 'Значение должно быть положительным числом' },
          ]}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            placeholder="Введите число"
            min={0}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ItemForm;
