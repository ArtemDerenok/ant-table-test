import { useState, type FC, useMemo } from "react";
import { Table, Button, Space, Modal, message, Input, Typography, Flex } from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import EditItemForm from "@components/Forms/EditItemForm/EditItemForm";
import AddItemForm from "@components/Forms/AddItemForm/AddItemForm";

const { Search } = Input;

interface DataItem {
  id: number;
  name: string;
  date: string;
  value: number;
}

const headerStyleColumn = {
  backgroundColor: "#4096ff",
  color: 'white',
};

const DataTable: FC = () => {
  const [data, setData] = useState<DataItem[]>([
    { id: 1, name: "Пример 1", date: "2024-01-15", value: 100 },
    { id: 2, name: "Пример 2", date: "2024-02-20", value: 200 },
    { id: 3, name: "Пример 3", date: "2024-03-10", value: 300 },
  ]);

  const [searchText, setSearchText] = useState('');

  const filteredData = useMemo(() => {
    if (!searchText.trim()) {
      return data;
    }

    const searchLower = searchText.toLowerCase().trim();
    
    return data.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(searchLower);
      
      const dateFormatted = dayjs(item.date).format('DD.MM.YYYY');
      const dateOriginal = item.date;
      const dateMatch = dateFormatted.includes(searchLower) || 
                       dateOriginal.includes(searchLower);
      
      const valueMatch = item.value.toString().includes(searchLower);
      
      return nameMatch || dateMatch || valueMatch;
    });
  }, [data, searchText]);

  const handleAdd = (newItem: DataItem) => {
    setData((prev) => [...prev, newItem]);
  };

  const handleEdit = (id: number, updatedItem: Omit<DataItem, "id">) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
    );
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Подтверждение удаления",
      content: "Вы уверены, что хотите удалить эту запись?",
      okText: "Да",
      cancelText: "Нет",
      onOk: () => {
        setData((prev) => prev.filter((item) => item.id !== id));
        message.success("Запись успешно удалена");
      },
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const columns: ColumnsType<DataItem> = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      onHeaderCell: () => {
        return {
          style: { ...headerStyleColumn },
        };
      },
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD.MM.YYYY"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      onHeaderCell: () => {
        return {
          style: { ...headerStyleColumn },
        };
      },
    },
    {
      title: "Числовое значение",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => a.value - b.value,
      onHeaderCell: () => {
        return {
          style: { ...headerStyleColumn },
        };
      },
    },
    {
      title: "Действия",
      key: "actions",
      onHeaderCell: () => {
        return {
          style: { ...headerStyleColumn },
        };
      },
      render: (_, record) => (
        <Space size="middle">
          <EditItemForm
            item={record}
            onEdit={handleEdit}
            trigger={<Button type="text" icon={<EditOutlined />} />}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Flex justify="space-between" align="center" wrap style={{marginBottom: 20}} gap={20}>
        <AddItemForm onAdd={handleAdd} />
        
        <Flex align="center" gap={8} wrap style={{ 
          maxWidth: "400px",
          width: '100%'
        }}>
          <Search
            placeholder="Поиск по имени, дате или значению..."
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            onSearch={handleSearch}
            onChange={handleSearchChange}
            value={searchText}
            style={{ width: "100%" }}
          />
        </Flex>
      </Flex>

      {searchText && (
        <Typography style={{ 
          marginBottom: "12px", 
          color: "#666",
          fontSize: "14px",
        }}>
          Найдено записей: {filteredData.length} из {data.length}
        </Typography>
      )}

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        size="small"
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showTotal: (total) => `Всего ${total} записей`,
        }}
        locale={{
          emptyText: searchText 
            ? `По запросу "${searchText}" ничего не найдено` 
            : "Нет данных",
        }}
      />
    </div>
  );
};

export default DataTable;
