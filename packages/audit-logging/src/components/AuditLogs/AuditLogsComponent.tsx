import { useEffect, useState, useCallback } from 'react';
import { useLocalization } from '@abpjs/core';
import { Modal, Alert, Button, FormField } from '@abpjs/theme-shared';
import {
  Box,
  Flex,
  Input,
  Table,
  Spinner,
  VStack,
  Text,
  Badge,
  Tabs,
} from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { useAuditLogs } from '../../hooks';
import { HTTP_METHODS, HTTP_STATUS_CODES } from '../../constants';
import type { AuditLogDto, GetAuditLogListDto } from '../../proxy/audit-logging/models';

/**
 * Props for AuditLogsComponent
 * @since 0.7.2
 * @since 4.0.0 - Updated to use AuditLogDto instead of AuditLogging.Log
 */
export interface AuditLogsComponentProps {
  /** Optional callback when an audit log is selected for viewing */
  onAuditLogSelected?: (log: AuditLogDto) => void;
}

/**
 * Filter state for audit logs
 */
interface FilterState {
  userName: string;
  url: string;
  applicationName: string;
  correlationId: string;
  httpMethod: string;
  httpStatusCode: string;
  minExecutionDuration: string;
  maxExecutionDuration: string;
  hasException: string;
}

const DEFAULT_FILTER_STATE: FilterState = {
  userName: '',
  url: '',
  applicationName: '',
  correlationId: '',
  httpMethod: '',
  httpStatusCode: '',
  minExecutionDuration: '',
  maxExecutionDuration: '',
  hasException: '',
};

/**
 * AuditLogsComponent - Component for viewing and managing audit logs
 *
 * This is the React equivalent of Angular's AuditLogsComponent.
 * It displays a paginated table of audit logs with filtering capabilities.
 *
 * @since 0.7.2
 * @updated 2.9.0 - Aligned with Angular's onQueryChange pattern (React already uses this via useEffect)
 */
export function AuditLogsComponent({ onAuditLogSelected }: AuditLogsComponentProps) {
  const { t } = useLocalization();
  const {
    auditLogs,
    totalCount,
    selectedLog,
    isLoading,
    error,
    sortKey,
    sortOrder,
    fetchAuditLogs,
    getAuditLogById,
    setSelectedLog,
  } = useAuditLogs();

  // Local state
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [activeTab, setActiveTab] = useState('overall');
  const [expandedActions, setExpandedActions] = useState<Set<number>>(new Set());
  const [expandedChanges, setExpandedChanges] = useState<Set<number>>(new Set());

  // Fetch audit logs on mount and when filters/pagination change
  useEffect(() => {
    const params: GetAuditLogListDto = {
      skipCount: page * pageSize,
      maxResultCount: pageSize,
      sorting: sortKey ? `${sortKey} ${sortOrder || 'desc'}` : undefined,
    };

    // Add filters
    if (filters.userName) params.userName = filters.userName;
    if (filters.url) params.url = filters.url;
    if (filters.applicationName) params.applicationName = filters.applicationName;
    if (filters.correlationId) params.correlationId = filters.correlationId;
    if (filters.httpMethod) params.httpMethod = filters.httpMethod;
    if (filters.httpStatusCode) params.httpStatusCode = parseInt(filters.httpStatusCode, 10);
    if (filters.minExecutionDuration) params.minExecutionDuration = parseInt(filters.minExecutionDuration, 10);
    if (filters.maxExecutionDuration) params.maxExecutionDuration = parseInt(filters.maxExecutionDuration, 10);
    if (filters.hasException !== '') params.hasException = filters.hasException === 'true';

    fetchAuditLogs(params);
  }, [page, pageSize, sortKey, sortOrder, fetchAuditLogs]);

  // Handle filter change
  const handleFilterChange = useCallback((field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Handle search/refresh
  const handleRefresh = useCallback(() => {
    setPage(0);
    const params: GetAuditLogListDto = {
      skipCount: 0,
      maxResultCount: pageSize,
      sorting: sortKey ? `${sortKey} ${sortOrder || 'desc'}` : undefined,
    };

    if (filters.userName) params.userName = filters.userName;
    if (filters.url) params.url = filters.url;
    if (filters.applicationName) params.applicationName = filters.applicationName;
    if (filters.correlationId) params.correlationId = filters.correlationId;
    if (filters.httpMethod) params.httpMethod = filters.httpMethod;
    if (filters.httpStatusCode) params.httpStatusCode = parseInt(filters.httpStatusCode, 10);
    if (filters.minExecutionDuration) params.minExecutionDuration = parseInt(filters.minExecutionDuration, 10);
    if (filters.maxExecutionDuration) params.maxExecutionDuration = parseInt(filters.maxExecutionDuration, 10);
    if (filters.hasException !== '') params.hasException = filters.hasException === 'true';

    fetchAuditLogs(params);
  }, [filters, pageSize, sortKey, sortOrder, fetchAuditLogs]);

  // Open detail modal
  const handleOpenModal = useCallback(
    async (id: string) => {
      const result = await getAuditLogById(id);
      if (result.success && result.data) {
        setModalVisible(true);
        setExpandedActions(new Set());
        setExpandedChanges(new Set());
        onAuditLogSelected?.(result.data);
      }
    },
    [getAuditLogById, onAuditLogSelected]
  );

  // Close modal
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedLog(null);
    setActiveTab('overall');
  }, [setSelectedLog]);

  // Get HTTP status code badge color
  const getHttpCodeColor = (code: number): string => {
    const firstDigit = code.toString()[0];
    switch (firstDigit) {
      case '2':
        return 'green';
      case '3':
        return 'yellow';
      case '4':
      case '5':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Get HTTP method badge color
  const getHttpMethodColor = (method: string): string => {
    switch (method) {
      case 'GET':
        return 'blue';
      case 'POST':
        return 'green';
      case 'DELETE':
        return 'red';
      case 'PUT':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  // Toggle action collapse
  const toggleAction = (index: number) => {
    setExpandedActions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Toggle change collapse
  const toggleChange = (index: number) => {
    setExpandedChanges((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box id="audit-logging-wrapper" className="card">
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          {t('AbpAuditLogging::AuditLogs')}
        </Text>
      </Flex>

      {/* Filter Card */}
      <Box mb={4} p={4} borderWidth="1px" borderRadius="md">
        <VStack gap={4} align="stretch">
          {/* First row of filters */}
          <Flex gap={4} flexWrap="wrap">
            <Box flex="1" minW="150px">
              <FormField label={t('AbpAuditLogging::UserName')}>
                <Input
                  value={filters.userName}
                  onChange={(e) => handleFilterChange('userName', e.target.value)}
                  placeholder={t('AbpAuditLogging::UserName')}
                />
              </FormField>
            </Box>
            <Box flex="1" minW="150px">
              <FormField label={t('AbpAuditLogging::UrlFilter')}>
                <Input
                  value={filters.url}
                  onChange={(e) => handleFilterChange('url', e.target.value)}
                  placeholder={t('AbpAuditLogging::UrlFilter')}
                />
              </FormField>
            </Box>
            <Box flex="1" minW="150px">
              <FormField label={t('AbpAuditLogging::MinDuration')}>
                <Input
                  type="number"
                  value={filters.minExecutionDuration}
                  onChange={(e) => handleFilterChange('minExecutionDuration', e.target.value)}
                  placeholder="0"
                />
              </FormField>
            </Box>
            <Box flex="1" minW="150px">
              <FormField label={t('AbpAuditLogging::MaxDuration')}>
                <Input
                  type="number"
                  value={filters.maxExecutionDuration}
                  onChange={(e) => handleFilterChange('maxExecutionDuration', e.target.value)}
                  placeholder="0"
                />
              </FormField>
            </Box>
            <Box flex="1" minW="150px">
              <FormField label={t('AbpAuditLogging::HttpMethod')}>
                <NativeSelectRoot>
                  <NativeSelectField
                    value={filters.httpMethod}
                    onChange={(e) => handleFilterChange('httpMethod', e.target.value)}
                  >
                    <option value="">{t('AbpAuditLogging::All')}</option>
                    {HTTP_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </NativeSelectField>
                </NativeSelectRoot>
              </FormField>
            </Box>
            <Box flex="1" minW="150px">
              <FormField label={t('AbpAuditLogging::HttpStatusCode')}>
                <NativeSelectRoot>
                  <NativeSelectField
                    value={filters.httpStatusCode}
                    onChange={(e) => handleFilterChange('httpStatusCode', e.target.value)}
                  >
                    <option value="">{t('AbpAuditLogging::All')}</option>
                    {HTTP_STATUS_CODES.map((status) => (
                      <option key={status.code} value={status.code.toString()}>
                        {status.code} - {status.message}
                      </option>
                    ))}
                  </NativeSelectField>
                </NativeSelectRoot>
              </FormField>
            </Box>
          </Flex>

          {/* Second row of filters */}
          <Flex gap={4} flexWrap="wrap" alignItems="flex-end">
            <Box flex="1" minW="150px">
              <FormField label={t('AbpAuditLogging::ApplicationName')}>
                <Input
                  value={filters.applicationName}
                  onChange={(e) => handleFilterChange('applicationName', e.target.value)}
                  placeholder={t('AbpAuditLogging::ApplicationName')}
                />
              </FormField>
            </Box>
            <Box flex="1" minW="150px">
              <FormField label={t('AbpAuditLogging::CorrelationId')}>
                <Input
                  value={filters.correlationId}
                  onChange={(e) => handleFilterChange('correlationId', e.target.value)}
                  placeholder={t('AbpAuditLogging::CorrelationId')}
                />
              </FormField>
            </Box>
            <Box flex="1" minW="150px">
              <FormField label={t('AbpAuditLogging::HasException')}>
                <NativeSelectRoot>
                  <NativeSelectField
                    value={filters.hasException}
                    onChange={(e) => handleFilterChange('hasException', e.target.value)}
                  >
                    <option value="">{t('AbpAuditLogging::All')}</option>
                    <option value="true">{t('AbpAuditLogging::Yes')}</option>
                    <option value="false">{t('AbpAuditLogging::No')}</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </FormField>
            </Box>
            <Box>
              <Button colorPalette="blue" onClick={handleRefresh}>
                {t('AbpAuditLogging::Refresh')}
              </Button>
            </Box>
          </Flex>
        </VStack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert status="error" mb={4}>
          {error}
        </Alert>
      )}

      {/* Loading Spinner */}
      {isLoading && auditLogs.length === 0 && (
        <Flex justifyContent="center" p={8}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Audit Logs Table */}
      {!isLoading && auditLogs.length === 0 ? (
        <Text textAlign="center" p={8} color="gray.500">
          {t('AbpAuditLogging::NoAuditLogsFound')}
        </Text>
      ) : (
        <Box borderWidth="1px" borderRadius="md" overflow="hidden">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>{t('AbpAuditLogging::Detail')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('AbpAuditLogging::HttpRequest')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('AbpAuditLogging::User')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('AbpAuditLogging::IpAddress')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('AbpAuditLogging::Time')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('AbpAuditLogging::Duration')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('AbpAuditLogging::ApplicationName')}</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {auditLogs.map((log) => (
                <Table.Row key={log.id}>
                  <Table.Cell>
                    <Button
                      size="sm"
                      colorPalette="blue"
                      onClick={() => handleOpenModal(log.id)}
                    >
                      <span>🔍</span>
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap={2} alignItems="center" flexWrap="wrap">
                      <Badge colorPalette={getHttpCodeColor(log.httpStatusCode ?? 0)}>
                        {log.httpStatusCode}
                      </Badge>
                      <Badge colorPalette={getHttpMethodColor(log.httpMethod)}>
                        {log.httpMethod}
                      </Badge>
                      <Text fontSize="sm" truncate maxW="200px">
                        {log.url}
                      </Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text truncate maxW="120px">
                      {log.userName}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text truncate maxW="120px">
                      {log.clientIpAddress}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm">{formatDate(log.executionTime)}</Text>
                  </Table.Cell>
                  <Table.Cell>{log.executionDuration} ms</Table.Cell>
                  <Table.Cell>
                    <Text truncate maxW="120px">
                      {log.applicationName}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Pagination */}
          {totalCount > pageSize && (
            <Flex justifyContent="space-between" alignItems="center" p={4} borderTopWidth="1px">
              <Text fontSize="sm">
                {`${page * pageSize + 1} - ${Math.min((page + 1) * pageSize, totalCount)} / ${totalCount}`}
              </Text>
              <Flex gap={2}>
                <Button
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  {t('AbpAuditLogging::Previous')}
                </Button>
                <Button
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t('AbpAuditLogging::Next')}
                </Button>
              </Flex>
            </Flex>
          )}
        </Box>
      )}

      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        header={t('AbpAuditLogging::Detail')}
        footer={
          <Button onClick={handleCloseModal}>{t('AbpAuditLogging::Close')}</Button>
        }
      >
        {selectedLog && (
          <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
            <Tabs.List>
              <Tabs.Trigger value="overall">{t('AbpAuditLogging::Overall')}</Tabs.Trigger>
              <Tabs.Trigger value="actions">
                {t('AbpAuditLogging::Actions')} ({selectedLog.actions?.length || 0})
              </Tabs.Trigger>
              <Tabs.Trigger value="changes">
                {t('AbpAuditLogging::Changes')} ({selectedLog.entityChanges?.length || 0})
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="overall">
              <VStack gap={3} align="stretch" pt={4}>
                <Flex>
                  <Text fontWeight="bold" minW="200px">
                    {t('AbpAuditLogging::HttpStatusCode')}
                  </Text>
                  <Badge colorPalette={getHttpCodeColor(selectedLog.httpStatusCode ?? 0)}>
                    {selectedLog.httpStatusCode}
                  </Badge>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" minW="200px">
                    {t('AbpAuditLogging::HttpMethod')}
                  </Text>
                  <Badge colorPalette={getHttpMethodColor(selectedLog.httpMethod)}>
                    {selectedLog.httpMethod}
                  </Badge>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" minW="200px">
                    {t('AbpAuditLogging::Url')}
                  </Text>
                  <Text wordBreak="break-all">{selectedLog.url}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" minW="200px">
                    {t('AbpAuditLogging::ClientIpAddress')}
                  </Text>
                  <Text>{selectedLog.clientIpAddress}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" minW="200px">
                    {t('AbpAuditLogging::ClientName')}
                  </Text>
                  <Text>{selectedLog.clientName || '-'}</Text>
                </Flex>
                {selectedLog.exceptions && (
                  <Flex direction="column">
                    <Text fontWeight="bold" minW="200px">
                      {t('AbpAuditLogging::Exceptions')}
                    </Text>
                    <Box
                      as="pre"
                      p={2}
                      bg="gray.100"
                      borderRadius="md"
                      fontSize="sm"
                      overflow="auto"
                      maxH="200px"
                    >
                      {selectedLog.exceptions}
                    </Box>
                  </Flex>
                )}
                <Flex>
                  <Text fontWeight="bold" minW="200px">
                    {t('AbpAuditLogging::UserName')}
                  </Text>
                  <Text>{selectedLog.userName || '-'}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" minW="200px">
                    {t('AbpAuditLogging::Time')}
                  </Text>
                  <Text>{formatDate(selectedLog.executionTime)}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" minW="200px">
                    {t('AbpAuditLogging::Duration')}
                  </Text>
                  <Text>{selectedLog.executionDuration} ms</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" minW="200px">
                    {t('AbpAuditLogging::BrowserInfo')}
                  </Text>
                  <Text fontSize="sm" wordBreak="break-all">
                    {selectedLog.browserInfo || '-'}
                  </Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" minW="200px">
                    {t('AbpAuditLogging::ApplicationName')}
                  </Text>
                  <Text>{selectedLog.applicationName || '-'}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" minW="200px">
                    {t('AbpAuditLogging::CorrelationId')}
                  </Text>
                  <Text fontSize="sm">{selectedLog.correlationId || '-'}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold" minW="200px">
                    {t('AbpAuditLogging::Comments')}
                  </Text>
                  <Text>{selectedLog.comments || '-'}</Text>
                </Flex>
                {Object.keys(selectedLog.extraProperties || {}).length > 0 && (
                  <Flex direction="column">
                    <Text fontWeight="bold" minW="200px">
                      {t('AbpAuditLogging::ExtraProperties')}
                    </Text>
                    <Box
                      as="pre"
                      p={2}
                      bg="gray.100"
                      borderRadius="md"
                      fontSize="sm"
                      overflow="auto"
                    >
                      {JSON.stringify(selectedLog.extraProperties, null, 2)}
                    </Box>
                  </Flex>
                )}
              </VStack>
            </Tabs.Content>

            <Tabs.Content value="actions">
              <VStack gap={3} align="stretch" pt={4}>
                {selectedLog.actions?.length === 0 && (
                  <Text color="gray.500">{t('AbpAuditLogging::NoActionsFound')}</Text>
                )}
                {selectedLog.actions?.map((action, index) => (
                  <Box key={action.id || index} borderWidth="1px" borderRadius="md">
                    <Box
                      as="button"
                      width="full"
                      p={2}
                      textAlign="left"
                      _hover={{ bg: 'gray.50' }}
                      onClick={() => toggleAction(index)}
                      cursor="pointer"
                    >
                      <Text>{action.serviceName}</Text>
                    </Box>
                    {expandedActions.has(index) && (
                      <Box p={4}>
                        <VStack gap={2} align="stretch">
                          <Flex>
                            <Text fontWeight="bold" minW="150px">
                              {t('AbpAuditLogging::Duration')}
                            </Text>
                            <Text>{action.executionDuration} ms</Text>
                          </Flex>
                          <Flex direction="column">
                            <Text fontWeight="bold">
                              {t('AbpAuditLogging::Parameters')}
                            </Text>
                            <Box
                              as="pre"
                              p={2}
                              bg="gray.100"
                              borderRadius="md"
                              fontSize="sm"
                              overflow="auto"
                            >
                              {action.parameters || '-'}
                            </Box>
                          </Flex>
                        </VStack>
                      </Box>
                    )}
                  </Box>
                ))}
              </VStack>
            </Tabs.Content>

            <Tabs.Content value="changes">
              <VStack gap={3} align="stretch" pt={4}>
                {selectedLog.entityChanges?.length === 0 && (
                  <Text color="gray.500">{t('AbpAuditLogging::NoChangesFound')}</Text>
                )}
                {selectedLog.entityChanges?.map((change, index) => (
                  <Box key={change.id || index} borderWidth="1px" borderRadius="md">
                    <Box
                      as="button"
                      width="full"
                      p={2}
                      textAlign="left"
                      _hover={{ bg: 'gray.50' }}
                      onClick={() => toggleChange(index)}
                      cursor="pointer"
                    >
                      <Text>{change.entityTypeFullName}</Text>
                    </Box>
                    {expandedChanges.has(index) && (
                      <Box p={4} overflow="auto">
                        <Table.Root size="sm">
                          <Table.Header>
                            <Table.Row>
                              <Table.ColumnHeader>
                                {t('AbpAuditLogging::PropertyName')}
                              </Table.ColumnHeader>
                              <Table.ColumnHeader>
                                {t('AbpAuditLogging::OriginalValue')}
                              </Table.ColumnHeader>
                              <Table.ColumnHeader>
                                {t('AbpAuditLogging::NewValue')}
                              </Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {change.propertyChanges?.map((prop, propIndex) => (
                              <Table.Row key={prop.id || propIndex}>
                                <Table.Cell>{prop.propertyName}</Table.Cell>
                                <Table.Cell>
                                  <Text fontSize="sm" truncate maxW="150px">
                                    {prop.originalValue || '-'}
                                  </Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text fontSize="sm" truncate maxW="150px">
                                    {prop.newValue || '-'}
                                  </Text>
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table.Root>
                      </Box>
                    )}
                  </Box>
                ))}
              </VStack>
            </Tabs.Content>
          </Tabs.Root>
        )}
      </Modal>
    </Box>
  );
}

export default AuditLogsComponent;
