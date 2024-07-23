import React from 'react';
import { Card, Col, Row, Progress, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';

const data = [
  { name: 'Jan', sales: 4000, profit: 2400 },
  { name: 'Feb', sales: 3000, profit: 1398 },
  { name: 'Mar', sales: 2000, profit: 9800 },
  { name: 'Apr', sales: 2780, profit: 3908 },
  { name: 'May', sales: 1890, profit: 4800 },
  { name: 'Jun', sales: 2390, profit: 3800 },
];

const Dashboard: React.FC = () => {
  const maxSales = Math.max(...data.map(item => item.sales));
  const maxProfit = Math.max(...data.map(item => item.profit));

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card className="h-full">
            <Statistic
              title="Umumiy savdo"
              value={112893}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <Progress percent={70} status="active" strokeColor="#3f8600" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="h-full">
            <Statistic
              title="Sotilgan tovarlar"
              value={9280}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingOutlined />}
            />
            <Progress percent={80} status="active" strokeColor="#1890ff" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="h-full">
            <Statistic
              title="Jami foyda"
              value={28000}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
              suffix="USD"
            />
            <Progress percent={55} status="active" strokeColor="#cf1322" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="h-full">
            <Statistic
              title="Yangi xaridorlar"
              value={6120}
              valueStyle={{ color: '#faad14' }}
              prefix={<UserOutlined />}
            />
            <Progress percent={65} status="active" strokeColor="#faad14" />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16} className="mt-8">
        <Col span={24}>
          <Card title="Savdo va foydadagi o'zgarishlar">
            <div className="flex h-64 items-end">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex justify-center items-end h-48">
                    <div 
                      className="w-8 bg-blue-500 mr-1" 
                      style={{height: `${(item.sales / maxSales) * 100}%`}}
                    ></div>
                    <div 
                      className="w-8 bg-green-500" 
                      style={{height: `${(item.profit / maxProfit) * 100}%`}}
                    ></div>
                  </div>
                  <div className="text-xs mt-2">{item.name}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex items-center mr-4">
                <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                <span>Savdo</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 mr-2"></div>
                <span>Foyda</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mt-8">
        <Col span={12}>
          <Card title="Eng xaridorgir mahsulotlar" className="h-full">
            <ul className="list-none p-0">
              <li className="mb-2">1. Product A - 1,234 units</li>
              <li className="mb-2">2. Product B - 987 units</li>
              <li className="mb-2">3. Product C - 765 units</li>
              <li className="mb-2">4. Product D - 543 units</li>
              <li>5. Product E - 321 units</li>
            </ul>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Oxirgi buyurtmalar" className="h-full">
            <ul className="list-none p-0">
              <li className="mb-2">Buyurtma #12345 - $1,234.56</li>
              <li className="mb-2">Buyurtma #12346 - $987.65</li>
              <li className="mb-2">Buyurtma #12347 - $765.43</li>
              <li className="mb-2">Buyurtma #12348 - $543.21</li>
              <li>Buyurtma #12349 - $321.98</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;