import React from 'react';
import { Booking } from '../types/hotel';
import { formatINR } from '../utils/bookingEngine';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Building2, MapPin, Phone } from 'lucide-react';

interface InvoiceModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNo = `INV-IND-${booking.id.replace(/[^0-9]/g, '').slice(-6) || '202601'}`;
  const invoiceDate = new Date(booking.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-amber-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Tax Invoice Verified
            </span>
            <span className="text-xs text-slate-500">GST Rule 46 Compliant</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print Folio
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Folio Content */}
        <div className="overflow-y-auto p-8 space-y-6 text-slate-800 bg-white" id="printable-invoice">
          {/* Header & GSTIN Branding */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-slate-300 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-slate-950">
                  HotelPro <span className="text-amber-700 italic">India</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Luxury Hospitality & Sanctuary Network Ltd.</p>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Lake Palace Road, Udaipur, Rajasthan 313001
              </p>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                GSTIN: <span className="font-mono text-slate-950">08AAACH1234F1Z5</span> · PAN: <span className="font-mono">AAACH1234F</span>
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold uppercase tracking-wider mb-1">
                TAX INVOICE / GUEST FOLIO
              </span>
              <p className="text-xs text-slate-500">
                Invoice No: <span className="font-mono font-bold text-slate-900">{invoiceNo}</span>
              </p>
              <p className="text-xs text-slate-500">Date of Issue: <span className="font-medium text-slate-800">{invoiceDate}</span></p>
              <p className="text-xs text-slate-500">
                Booking ID: <span className="font-mono text-slate-800">{booking.id}</span>
              </p>
            </div>
          </div>

          {/* Billed To (Guest) & Hotel Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1 text-amber-800">
                Guest Information (Billed To)
              </p>
              <p className="font-bold text-slate-950 text-sm">{booking.guestDetails.name}</p>
              <p className="text-slate-600 mt-0.5 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" /> {booking.guestDetails.phone}
              </p>
              <p className="text-slate-600">{booking.guestDetails.email}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Place of Supply: <span className="font-semibold text-slate-800">{booking.hotelCity}, India</span> (State Code: 08)
              </p>
            </div>

            <div className="sm:border-l sm:border-slate-200 sm:pl-6">
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1 text-amber-800">
                Reservation Details
              </p>
              <p className="font-bold text-slate-950">{booking.hotelName}</p>
              <p className="text-slate-700 font-medium">{booking.roomName}</p>
              <div className="mt-1 space-y-0.5 text-slate-600">
                <p>Check-in: <span className="font-medium text-slate-800">{booking.checkInDate} (2:00 PM)</span></p>
                <p>Check-out: <span className="font-medium text-slate-800">{booking.checkOutDate} (11:00 AM)</span></p>
                <p>Duration: <span className="font-medium text-slate-800">{booking.priceBreakdown.numberOfNights} Nights</span> · {booking.numberOfGuests} Guests</p>
              </div>
            </div>
          </div>

          {/* Itemized Tax Breakdown Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Item & SAC Description</th>
                  <th className="py-2.5 px-3 text-center">SAC Code</th>
                  <th className="py-2.5 px-3 text-center">Nights</th>
                  <th className="py-2.5 px-4 text-right">Taxable Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{booking.roomName} Accommodation</p>
                    <p className="text-[11px] text-slate-500">Luxury Heritage Room Tariff</p>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">996311</td>
                  <td className="py-3 px-3 text-center text-slate-700">{booking.priceBreakdown.numberOfNights}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-900">
                    {formatINR(booking.priceBreakdown.baseTariff)}
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">Resort & Heritage Hospitality Amenity Fee</p>
                    <p className="text-[11px] text-slate-500">Wi-Fi, Shikara Transfers, Mineral Water & Morning Tea</p>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">996311</td>
                  <td className="py-3 px-3 text-center text-slate-700">{booking.priceBreakdown.numberOfNights}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-900">
                    {formatINR(booking.priceBreakdown.resortFee)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Calculations and Taxes */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Taxable Amount (Subtotal):</span>
                <span className="font-semibold text-slate-900">
                  {formatINR(booking.priceBreakdown.baseTariff + booking.priceBreakdown.resortFee)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Central GST (CGST @ 9%):</span>
                <span className="font-semibold text-slate-900">{formatINR(booking.priceBreakdown.cgstAmount)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>State GST (SGST @ 9%):</span>
                <span className="font-semibold text-slate-900">{formatINR(booking.priceBreakdown.sgstAmount)}</span>
              </div>

              <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline">
                <div>
                  <p className="text-sm font-bold text-slate-950 uppercase tracking-wider">Grand Total (Net Invoice Value):</p>
                  <p className="text-[10px] text-slate-500">Paid in full via {booking.paymentMethod} (Ref: {booking.id.slice(0, 8)})</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-serif text-slate-950">
                    {formatINR(booking.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Sign-off */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-500">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Electronically verified GST Tax Invoice
              </div>
              <p className="text-[11px] text-slate-400">
                Whether tax is payable on reverse charge basis: No
              </p>
              <p className="text-[11px] text-slate-400">
                This is a computer-generated tax folio and does not require a physical signature.
              </p>
            </div>

            <div className="text-center sm:text-right sm:w-48">
              <div className="border-b border-slate-300 pb-1 mb-1 font-serif italic text-slate-700 font-bold">
                HotelPro India Ltd.
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition"
          >
            Close Folio
          </button>
        </div>
      </div>
    </div>
  );
};
