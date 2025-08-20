import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, FileText, Users, UserCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardStats, getDashboardChartData, getRegistrationsByCategory, DashboardStats, ChartData } from '@/lib/api/dashboard';

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trend }) => (
  <Card className="shadow-card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="text-primary">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-primary">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      {trend && (
        <div className="flex items-center mt-2 text-xs">
          <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
          <span className="text-green-500">+{trend}% ce mois</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    formations: { total: 0, published: 0 },
    posts: { total: 0, published: 0 },
    registrations: { total: 0, confirmed: 0, pending: 0 },
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number; percentage: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pieColors = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupération parallèle de toutes les données
        const [statsData, chartDataResult, categoryDataRaw] = await Promise.all([
          getDashboardStats(),
          getDashboardChartData(),
          getRegistrationsByCategory(),
        ]);

        setStats(statsData);
        setChartData(chartDataResult);
        
        // Transform category data for the pie chart
        const totalCategoryRegistrations = categoryDataRaw.reduce((sum, item) => sum + item.count, 0);
        const transformedCategoryData = categoryDataRaw.map(item => ({
          name: item.category,
          value: item.count,
          percentage: totalCategoryRegistrations > 0 ? Math.round((item.count / totalCategoryRegistrations) * 100) : 0,
        }));
        setCategoryData(transformedCategoryData);
      } catch (err) {
        console.error('Erreur lors du chargement des données du dashboard:', err);
        setError('Erreur lors du chargement des données du dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-1">
          <h1 className="text-responsive-xl font-bold text-primary">Dashboard</h1>
          <p className="text-responsive-base text-muted-foreground">
            Chargement des données...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-1">
          <h1 className="text-responsive-xl font-bold text-primary">Dashboard</h1>
          <p className="text-responsive-base text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* En-tête */}
      <div className="space-y-1">
        <h1 className="text-responsive-xl font-bold text-primary">Dashboard</h1>
        <p className="text-responsive-base text-muted-foreground">
          Vue d'ensemble de votre plateforme de formation
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Formations"
          value={stats.formations.published}
          description={`${stats.formations.total} au total`}
          icon={<BookOpen className="h-4 w-4" />}
          trend={12}
        />
        
        <StatCard
          title="Articles"
          value={stats.posts.published}
          description={`${stats.posts.total} au total`}
          icon={<FileText className="h-4 w-4" />}
          trend={8}
        />
        
        <StatCard
          title="Préinscriptions"
          value={stats.registrations.total}
          description={`${stats.registrations.pending} en attente`}
          icon={<Users className="h-4 w-4" />}
          trend={25}
        />
        
        <StatCard
          title="Confirmées"
          value={stats.registrations.confirmed}
          description="Inscriptions validées"
          icon={<UserCheck className="h-4 w-4" />}
          trend={18}
        />
      </div>

      {/* Graphiques */}
      <div className="space-y-6">
        {/* Ligne 1 : Inscriptions par mois et par catégorie */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Graphique en barres - Inscriptions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-primary">Inscriptions par mois</CardTitle>
            <CardDescription>
              Évolution des préinscriptions et confirmations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                    }}
                  />
                  <Bar 
                    dataKey="registrations" 
                    fill="hsl(var(--primary))"
                    name="Préinscriptions"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar 
                    dataKey="confirmations" 
                    fill="hsl(var(--chart-2))"
                    name="Confirmations"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>


        {/* Graphique circulaire - Inscriptions par catégorie */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-primary">Inscriptions par catégorie</CardTitle>
            <CardDescription>
              Répartition des préinscriptions par domaine de formation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                    }}
                    formatter={(value, name, props) => [
                      `${props.payload.percentage}% (${value} inscriptions)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: pieColors[index % pieColors.length] }}
                  />
                  <span className="text-sm font-medium">{entry.name}</span>
                  <span className="text-sm text-muted-foreground">({entry.percentage}% - {entry.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Ligne 2 : Tendance des confirmations sur toute la largeur */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-primary">Tendance des confirmations</CardTitle>
            <CardDescription>
              Taux de conversion des préinscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confirmations" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};