import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useTable, usePagination, useSortBy, useFilters, useRowSelect } from 'react-table';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import { AiOutlineDownload, AiOutlinePrinter } from 'react-icons/ai';

const ViewTableInvoice = () => {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/invoices');
        if (Array.isArray(response.data)) {
          setTenants(response.data);
        } else {
          console.error('Unexpected response structure:', response.data);
          setTenants([]);
        }
      } catch (error) {
        console.error('Error fetching invoice data:', error);
        setTenants([]);
      }
    };

    fetchInvoiceData();
  }, []);

  const generateInvoiceID = () => {
    return 'INV-' + Math.floor(100000 + Math.random() * 900000);
  };

  const data = useMemo(() => {
    return tenants.map((tenant) => {
      const invoiceID = generateInvoiceID();
      const property = tenant.property || {};
      return {
        ...tenant,
        invoiceID,
        propertyName: property.name || 'N/A',
        location: property.location || 'N/A',
        rentType: property.rent_type || 'N/A',
        rentAmount: property.rentAmount || '0.00',
      };
    });
  }, [tenants]);

  const columns = useMemo(
    () => [
      {
        Header: 'Invoice ID',
        accessor: 'invoiceID',
      },
      {
        Header: 'Tenant Name',
        accessor: 'name',
      },
      {
        Header: 'Phone No',
        accessor: 'phoneNumber',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Property Name',
        accessor: 'propertyName',
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: 'Rent Type',
        accessor: 'rentType',
      },
      {
        Header: 'Rent Amount',
        accessor: 'rentAmount',
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <PDFDownloadLink
              document={<InvoicePDF tenant={row.original} property={row.original.property || {}} invoiceID={row.original.invoiceID} />}
              fileName={`${row.original.invoiceID}.pdf`}
            >
              {({ loading }) =>
                loading ? (
                  <button className="bg-blue-500 text-white px-2 py-1 rounded disabled">
                    Loading...
                  </button>
                ) : (
                  <button className="bg-blue-500 text-white px-2 py-1 rounded flex items-center space-x-1">
                    <AiOutlineDownload />
                    <span>PDF</span>
                  </button>
                )
              }
            </PDFDownloadLink>
            <button
              onClick={() => handlePrint(row.original)}
              className="bg-green-500 text-white px-2 py-1 rounded flex items-center space-x-1"
            >
              <AiOutlinePrinter />
              <span>Print</span>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setFilter,
    state: { pageIndex, pageSize, selectedRowIds },
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 },
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect
  );

  const handlePrint = (tenant) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const printContent = `
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h2 {
              font-size: 24px;
              margin-bottom: 10px;
            }
            p {
              font-size: 18px;
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div>
            <h2>Invoice Details for ${tenant.name}</h2>
            <p><strong>Invoice ID:</strong> ${tenant.invoiceID}</p>
            <p><strong>Phone Number:</strong> ${tenant.phoneNumber}</p>
            <p><strong>Email:</strong> ${tenant.email}</p>
            <p><strong>Property Name:</strong> ${tenant.propertyName}</p>
            <p><strong>Location:</strong> ${tenant.location}</p>
            <p><strong>Rent Type:</strong> ${tenant.rentType}</p>
            <p><strong>Rent Amount:</strong> $${tenant.rentAmount}</p>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-gray-100">
        <h2 className="text-2xl mb-4">Invoice Table</h2>
        <div className="mb-4">
          <label className="text-gray-300">Filter by Tenant Name:</label>
          <input
            className="mt-1 p-2 bg-gray-800 border border-gray-600 rounded w-full"
            onChange={(e) => setFilter('name', e.target.value)}
            placeholder="Enter tenant name"
          />
        </div>
        <table {...getTableProps()} className="min-w-full border-collapse border border-gray-700">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border border-gray-700 px-4 py-2 text-left"
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-700">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="border border-gray-700 px-4 py-2">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <button onClick={() => previousPage()} disabled={!canPreviousPage} className="bg-gray-700 text-white px-3 py-1 rounded">
              Previous
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage} className="bg-gray-700 text-white px-3 py-1 ml-2 rounded">
              Next
            </button>
          </div>
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-gray-700 text-white rounded px-2 py-1"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default ViewTableInvoice;
