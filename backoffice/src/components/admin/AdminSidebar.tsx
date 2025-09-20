'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  DollarSign,
  BarChart3,
  Bell,
  Shield,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useAdminAuth } from '@/lib/auth/admin-context'
import {
  Box,
  Flex,
  Text,
  Icon,
  Button,
  Avatar,
  Badge,
  useColorModeValue,
  VStack,
  HStack,
  Divider,
  IconButton,
  Heading,
  useDisclosure
} from '@chakra-ui/react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Platform analytics and overview'
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'Manage and view all users'
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Detailed analytics and reports'
  },
  {
    name: 'Revenue',
    href: '/admin/revenue',
    icon: DollarSign,
    description: 'Revenue tracking and billing'
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: FileText,
    description: 'Content management and moderation'
  },
  {
    name: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
    description: 'System notifications and alerts'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System configuration'
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { adminUser, logout } = useAdminAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const activeBg = useColorModeValue('red.50', 'red.900')
  const activeColor = useColorModeValue('red.700', 'red.200')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const activeIconColor = useColorModeValue('red.600', 'red.300')

  return (
    <>
      {/* Mobile sidebar button */}
      <Box
        position="fixed"
        top="4"
        left="4"
        zIndex="50"
        display={{ lg: 'none' }}
      >
        <IconButton
          onClick={isOpen ? onClose : onOpen}
          bg="white"
          shadow="md"
          border="1px"
          borderColor="gray.200"
          aria-label="Toggle sidebar"
        >
          <Icon as={isOpen ? X : Menu} w="5" h="5" color="gray.600" />
        </IconButton>
      </Box>

      {/* Sidebar overlay for mobile */}
      <Box
        position="fixed"
        inset="0"
        bg="blackAlpha.50"
        zIndex="40"
        display={{ lg: 'none' }}
        onClick={onClose}
        opacity={isOpen ? 1 : 0}
        transition="opacity 0.3s ease-in-out"
        pointerEvents={isOpen ? 'auto' : 'none'}
      />

      {/* Sidebar */}
      <Box
        position="fixed"
        insetY="0"
        left="0"
        zIndex="40"
        w="64"
        bg={bg}
        shadow="xl"
        borderRight="1px"
        borderColor={borderColor}
        transform={{ base: isOpen ? 'translateX(0)' : 'translateX(-100%)', lg: 'translateX(0)' }}
        transition="transform 0.3s ease-in-out"
        display={{ lg: 'block' }}
      >
        <VStack h="full" spacing="0">
          {/* Logo and Header */}
          <Flex
            align="center"
            justify="space-between"
            p="6"
            borderBottom="1px"
            borderColor={borderColor}
          >
            <HStack spacing="3">
              <Flex
                w="10"
                h="10"
                bgGradient="linear(to-r, red.600, orange.600)"
                rounded="xl"
                align="center"
                justify="center"
              >
                <Icon as={Shield} w="6" h="6" color="white" />
              </Flex>
              <Box>
                <Heading size="sm" color="gray.900">Admin Panel</Heading>
                <Text fontSize="xs" color="gray.500">Smart Notes</Text>
              </Box>
            </HStack>
            <IconButton
              onClick={onClose}
              display={{ lg: 'none' }}
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'gray.600' }}
              aria-label="Close sidebar"
            >
              <Icon as={X} w="5" h="5" />
            </IconButton>
          </Flex>

          {/* Navigation */}
          <VStack
            flex="1"
            px="4"
            py="6"
            spacing="2"
            overflowY="auto"
            align="stretch"
          >
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  passHref
                >
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    w="full"
                    bg={isActive ? activeBg : 'transparent'}
                    color={isActive ? activeColor : textColor}
                    _hover={{ bg: hoverBg, color: 'gray.900' }}
                    borderRadius="lg"
                    px="4"
                    py="3"
                    h="auto"
                  >
                    <HStack w="full" spacing="3">
                      <Icon
                        as={item.icon}
                        w="5"
                        h="5"
                        color={isActive ? activeIconColor : 'gray.400'}
                        _groupHover={{ color: 'gray.500' }}
                      />
                      <VStack align="start" spacing="0" flex="1">
                        <Text fontWeight="medium">{item.name}</Text>
                        {item.description && (
                          <Text fontSize="xs" color={isActive ? activeColor : 'gray.500'}>
                            {item.description}
                          </Text>
                        )}
                      </VStack>
                      {isActive && (
                        <Box w="2" h="2" bg="red.600" rounded="full" />
                      )}
                    </HStack>
                  </Button>
                </Link>
              )
            })}
          </VStack>

          {/* User Profile Section */}
          <VStack
            p="4"
            spacing="3"
            borderTop="1px"
            borderColor={borderColor}
          >
            <Box bg={useColorModeValue('gray.50', 'gray.700')} rounded="lg" p="4" w="full">
              <HStack spacing="3" mb="3">
                <Avatar
                  size="sm"
                  name={adminUser?.email}
                  bgGradient="linear(to-r, red.500, orange.500)"
                >
                  {adminUser?.email.split('@')[0].charAt(0).toUpperCase()}
                </Avatar>
                <Box flex="1" minW="0">
                  <Text fontSize="sm" fontWeight="medium" color="gray.900" noOfLines={1}>
                    {adminUser?.email}
                  </Text>
                  <Text fontSize="xs" color="gray.500">Administrator</Text>
                </Box>
              </HStack>
              <VStack spacing="2">
                <Link href="/admin/settings" onClick={onClose} passHref>
                  <Button
                    variant="outline"
                    size="xs"
                    w="full"
                    bg="white"
                    color="gray.700"
                    borderColor="gray.200"
                    leftIcon={<Icon as={Settings} w="3" h="3" />}
                  >
                    Account Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="xs"
                  w="full"
                  bg="red.50"
                  color="red.700"
                  _hover={{ bg: 'red.100' }}
                  leftIcon={<Icon as={LogOut} w="3" h="3" />}
                  onClick={() => {
                    logout()
                    onClose()
                  }}
                >
                  Sign Out
                </Button>
              </VStack>
            </Box>

            {/* Footer */}
            <Box w="full" textAlign="center" pt="2">
              <Text fontSize="xs" color="gray.500">
                © 2024 Smart Notes
              </Text>
              <Text fontSize="xs" color="gray.500">
                Admin Panel v1.0
              </Text>
            </Box>
          </VStack>
        </VStack>
      </Box>
    </>
  )
}