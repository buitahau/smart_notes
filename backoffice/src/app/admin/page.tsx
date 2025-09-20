'use client'

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Activity,
  Download,
  RefreshCw,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  Box,
  Grid,
  GridItem,
  Flex,
  Text,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
  Heading,
  HStack,
  Badge,
  VStack,
  Spacer,
  Avatar,
  IconButton,
  useColorModeValue,
  Divider
} from '@chakra-ui/react'

// Mock data for admin dashboard
const userGrowthData = [
  { month: 'Jan', users: 1200, notes: 8500 },
  { month: 'Feb', users: 1580, notes: 11200 },
  { month: 'Mar', users: 2100, notes: 15800 },
  { month: 'Apr', users: 2650, notes: 19200 },
  { month: 'May', users: 3200, notes: 23400 },
  { month: 'Jun', users: 3850, notes: 28900 },
  { month: 'Jul', users: 4200, notes: 31200 },
  { month: 'Aug', users: 4650, notes: 34500 },
  { month: 'Sep', users: 5100, notes: 37800 },
  { month: 'Oct', users: 5450, notes: 40200 },
  { month: 'Nov', users: 5800, notes: 42500 },
  { month: 'Dec', users: 6200, notes: 45800 }
]

const revenueData = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 15800 },
  { month: 'Mar', revenue: 19200 },
  { month: 'Apr', revenue: 22500 },
  { month: 'May', revenue: 26800 },
  { month: 'Jun', revenue: 31200 },
  { month: 'Jul', revenue: 34500 },
  { month: 'Aug', revenue: 37800 },
  { month: 'Sep', revenue: 40200 },
  { month: 'Oct', revenue: 42500 },
  { month: 'Nov', revenue: 45800 },
  { month: 'Dec', revenue: 48200 }
]

const planDistribution = [
  { name: 'Free', value: 65, color: '#6b7280' },
  { name: 'Pro', value: 28, color: '#3b82f6' },
  { name: 'Team', value: 7, color: '#8b5cf6' }
]

const recentUsers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    plan: 'Pro',
    joined: '2024-01-15',
    notes: 156,
    status: 'active'
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    plan: 'Free',
    joined: '2024-01-14',
    notes: 89,
    status: 'active'
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    plan: 'Team',
    joined: '2024-01-13',
    notes: 234,
    status: 'active'
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    email: 'alex.r@email.com',
    plan: 'Pro',
    joined: '2024-01-12',
    notes: 178,
    status: 'inactive'
  }
]

const adminStats = [
  {
    title: 'Total Users',
    value: '6,247',
    change: '+12.5%',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Total Notes',
    value: '45,823',
    change: '+18.3%',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Monthly Revenue',
    value: '$48,200',
    change: '+15.7%',
    icon: DollarSign,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'Active Users',
    value: '5,892',
    change: '+8.2%',
    icon: Activity,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
]

export default function AdminDashboard() {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const statBg = useColorModeValue('gray.50', 'gray.700')

  const getStatColor = (color: string) => {
    const colors: Record<string, string> = {
      'text-blue-600': 'blue.600',
      'text-green-600': 'green.600',
      'text-purple-600': 'purple.600',
      'text-orange-600': 'orange.600',
      'bg-blue-50': 'blue.50',
      'bg-green-50': 'green.50',
      'bg-purple-50': 'purple.50',
      'bg-orange-50': 'orange.50'
    }
    return colors[color] || 'gray.600'
  }

  return (
    <AdminLayout
      title="Dashboard"
      description="Platform analytics and overview"
    >
      <Box>
        {/* Admin Stats */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="6" mb="8">
          {adminStats.map((stat) => (
            <Card key={stat.title} bg={cardBg} shadow="sm" border="1px" borderColor={borderColor}>
              <CardBody p="6">
                <Flex justify="space-between" align="center">
                  <Box>
                    <Stat>
                      <StatLabel color="gray.600" fontSize="sm">{stat.title}</StatLabel>
                      <StatNumber color="gray.900" fontSize="2xl" fontWeight="bold">{stat.value}</StatNumber>
                      <StatHelpText color="green.600" fontSize="sm" mt="1">{stat.change}</StatHelpText>
                    </Stat>
                  </Box>
                  <Flex
                    w="12"
                    h="12"
                    bg={getStatColor(stat.bgColor)}
                    rounded="lg"
                    align="center"
                    justify="center"
                  >
                    <Icon as={stat.icon} w="6" h="6" color={getStatColor(stat.color)} />
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </Grid>

        {/* Charts Grid */}
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap="6" mb="8">
          {/* User Growth Chart */}
          <Card bg={cardBg} shadow="sm" border="1px" borderColor={borderColor}>
            <CardHeader pb="6">
              <Flex justify="space-between" align="center">
                <Heading size="md" color="gray.900">User Growth & Notes</Heading>
                <HStack spacing="2">
                  <Icon as={RefreshCw} w="4" h="4" color="gray.400" />
                  <Text fontSize="sm" color="gray.500">Last 12 months</Text>
                </HStack>
              </Flex>
            </CardHeader>
            <CardBody pt="0">
              <Box h="80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Users"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="notes"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Notes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          {/* Revenue Chart */}
          <Card bg={cardBg} shadow="sm" border="1px" borderColor={borderColor}>
            <CardHeader pb="6">
              <Flex justify="space-between" align="center">
                <Heading size="md" color="gray.900">Monthly Revenue</Heading>
                <HStack spacing="2">
                  <Icon as={Download} w="4" h="4" color="gray.400" />
                  <Text fontSize="sm" color="gray.500">Export</Text>
                </HStack>
              </Flex>
            </CardHeader>
            <CardBody pt="0">
              <Box h="80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8b5cf6"
                      fill="url(#colorGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>
        </Grid>

        <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap="6">
          {/* Plan Distribution */}
          <Card bg={cardBg} shadow="sm" border="1px" borderColor={borderColor}>
            <CardHeader pb="6">
              <Heading size="md" color="gray.900">Plan Distribution</Heading>
            </CardHeader>
            <CardBody pt="0">
              <Box h="64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          {/* Recent Users */}
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <Card bg={cardBg} shadow="sm" border="1px" borderColor={borderColor}>
              <CardHeader pb="6">
                <Flex justify="space-between" align="center">
                  <Heading size="md" color="gray.900">Recent Users</Heading>
                  <HStack spacing="2">
                    <Icon as={Search} w="4" h="4" color="gray.400" />
                    <Icon as={Filter} w="4" h="4" color="gray.400" />
                  </HStack>
                </Flex>
              </CardHeader>
              <CardBody pt="0">
                <VStack spacing="4" align="stretch">
                  {recentUsers.map((user) => (
                    <Flex
                      key={user.id}
                      justify="space-between"
                      align="center"
                      p="4"
                      rounded="lg"
                      bg={statBg}
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                      transition="background-color 0.2s"
                    >
                      <HStack spacing="4">
                        <Avatar size="sm" bg="gray.100">
                          <Icon as={Users} w="5" h="5" color="gray.600" />
                        </Avatar>
                        <Box>
                          <Text fontWeight="medium" color="gray.900">{user.name}</Text>
                          <Text fontSize="sm" color="gray.500">{user.email}</Text>
                        </Box>
                      </HStack>
                      <HStack spacing="6">
                        <Box textAlign="right">
                          <Text fontSize="sm" fontWeight="medium" color="gray.900">{user.notes} notes</Text>
                          <Text fontSize="xs" color="gray.500">Joined {user.joined}</Text>
                        </Box>
                        <HStack spacing="2">
                          <Badge
                            colorScheme={
                              user.plan === 'Pro' ? 'blue' :
                              user.plan === 'Team' ? 'purple' : 'gray'
                            }
                            variant="subtle"
                            fontSize="xs"
                            px="2"
                            py="1"
                          >
                            {user.plan}
                          </Badge>
                          <Box
                            w="2"
                            h="2"
                            rounded="full"
                            bg={user.status === 'active' ? 'green.500' : 'red.500'}
                          />
                        </HStack>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          color="gray.400"
                          _hover={{ color: 'gray.600' }}
                          aria-label="More options"
                        >
                          <Icon as={MoreVertical} w="4" h="4" />
                        </IconButton>
                      </HStack>
                    </Flex>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
    </AdminLayout>
  )
}