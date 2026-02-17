import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import { useState, useEffect } from "react";

// Interfaces
interface MonthlyData {
  name: string;
  revenue: number;
  orders: number;
}

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

interface AnalyticsStats {
  totalRevenue: number;
  totalOrders: number;
  newCustomers: number;
  conversionRate: number;
  monthlyData: MonthlyData[];
  categoryData: CategoryData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsStats>({
    totalRevenue: 0,
    totalOrders: 0,
    newCustomers: 0,
    conversionRate: 0,
    monthlyData: [],
    categoryData: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await api.get('/admin/analytics/stats');
        setAnalyticsData(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: `LKR ${analyticsData.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+12.5%",
      color: "text-blue-600"
    },
    {
      label: "Total Orders",
      value: analyticsData.totalOrders.toString(),
      icon: ShoppingBag,
      trend: "+8.2%",
      color: "text-green-600"
    },
    {
      label: "New Customers",
      value: analyticsData.newCustomers.toString(),
      icon: Users,
      trend: "+15.3%",
      color: "text-purple-600"
    },
    {
      label: "Conversion Rate",
      value: `${analyticsData.conversionRate}%`,
      icon: TrendingUp,
      trend: "+2.1%",
      color: "text-orange-600"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      {/* Header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Business Analytics</h1>
        <p className="text-muted-foreground font-medium text-sm">Deep dive into your store's performance and growth.</p>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-md rounded-[2rem] bg-card group hover:scale-[1.02] transition-transform">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-muted rounded-2xl group-hover:bg-primary/10 transition-colors">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <Badge className="bg-green-100 text-green-600 border-none font-bold text-[10px] py-1 px-2 rounded-full flex items-center">
                  {stat.trend} <ArrowUpRight className="h-3 w-3 ml-1" />
                </Badge>
              </div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-2xl font-black italic tracking-tighter leading-none">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-[2.5rem] border-none shadow-xl p-6 bg-card">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-black uppercase italic tracking-tight">Revenue Growth (6 Months)</CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.monthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-xl p-6 bg-card">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-black uppercase italic tracking-tight">Sales by Category</CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Bar Chart */}
      <Card className="rounded-[2.5rem] border-none shadow-xl p-8 bg-card">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-black uppercase italic tracking-tight">Order Volume per Month</CardTitle>
        </CardHeader>
        <div className="h-[300px] w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="orders" fill="#8b5cf6" radius={[10, 10, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AdminAnalytics;