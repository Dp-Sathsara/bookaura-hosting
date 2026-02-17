import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

import api from "@/services/api";
import { useState, useEffect } from "react";

interface ChartData {
  name: string;
  value: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: string;
  date: string;
}

interface DashboardStats {
  totalRevenue: number;
  activeOrders: number;
  totalBooks: number;
  completedOrders: number;
  salesData: ChartData[];
  trafficData: ChartData[];
  recentOrders: RecentOrder[];
}

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState<DashboardStats>({
    totalRevenue: 0,
    activeOrders: 0,
    totalBooks: 0,
    completedOrders: 0,
    salesData: [],
    trafficData: [],
    recentOrders: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard-stats');
        setStatsData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Total Revenue", value: `LKR ${statsData.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Active Orders", value: statsData.activeOrders.toString(), icon: ShoppingBag, color: "text-green-600 dark:text-emerald-400", bg: "bg-green-100 dark:bg-emerald-950/30" },
    { label: "Total Books", value: statsData.totalBooks.toString(), icon: Package, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-950/30" },
    { label: "Complete Orders", value: `${statsData.completedOrders}`, icon: TrendingUp, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-950/30" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Page Header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Overview</h1>
        <p className="text-muted-foreground font-medium text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-md rounded-[2rem] overflow-hidden bg-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`${stat.bg} p-4 rounded-2xl`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">{stat.label}</p>
                <p className="text-xl font-black italic tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <Card className="rounded-[2.5rem] border-none shadow-lg p-6 bg-card min-h-[350px]">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-black uppercase italic tracking-tight flex items-center gap-2 text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" /> Sales Analytics
            </CardTitle>
          </CardHeader>
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData.salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} stroke="currentColor" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: 'currentColor' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '15px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px', color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Traffic Chart */}
        <Card className="rounded-[2.5rem] border-none shadow-lg p-6 bg-card min-h-[350px]">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-black uppercase italic tracking-tight flex items-center gap-2 text-foreground">
              <Users className="h-4 w-4 text-primary" /> Customer Traffic
            </CardTitle>
          </CardHeader>
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData.trafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} stroke="currentColor" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: 'currentColor' }} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '15px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px', color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[10, 10, 10, 10]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card className="rounded-[2.5rem] border-none shadow-lg p-8 bg-card text-card-foreground">
        <h2 className="text-xl font-black uppercase italic tracking-tight mb-4">Recent Transactions</h2>
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-xs font-black tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {statsData.recentOrders && statsData.recentOrders.length > 0 ? (
                statsData.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">#{order.id.slice(-6)}</td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold">LKR {order.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider
                        ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' :
                          order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400' :
                            order.status === 'Processing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' :
                              'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic">
                    No recent transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;