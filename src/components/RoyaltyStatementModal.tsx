import React from 'react';
import { X, Printer, Download, FileSpreadsheet, CheckCircle, Shield } from 'lucide-react';
import { RoyaltyStatement, ContributorProfile } from '../types';

interface RoyaltyStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  statement: RoyaltyStatement | null;
  profile: ContributorProfile;
}

export const RoyaltyStatementModal: React.FC<RoyaltyStatementModalProps> = ({
  isOpen,
  onClose,
  statement,
  profile,
}) => {
  if (!isOpen || !statement) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const csvContent = [
      ['Getty Images Contributor Royalty Statement'],
      ['Statement Number', statement.statementNumber],
      ['Period Month', statement.periodMonth],
      ['Payout Date', statement.payoutDate],
      ['Contributor Name', profile.name],
      ['Contributor ID', profile.id],
      ['Studio', profile.studioName],
      ['Tier', profile.tier],
      ['Royalty Rate', profile.royaltyRate],
      ['Tax Profile', profile.taxStatus],
      [],
      ['Collection Channel', 'Licenses Sold', 'Net Royalty (USD)'],
      ['iStock Signature', statement.breakdown.istockSignatureLicenses, statement.breakdown.istockSignatureUSD.toFixed(2)],
      ['iStock Essentials', statement.breakdown.istockEssentialsLicenses, statement.breakdown.istockEssentialsUSD.toFixed(2)],
      ['Getty Images Creative', statement.breakdown.gettyCreativeLicenses, statement.breakdown.gettyCreativeUSD.toFixed(2)],
      ['Extended / Commercial Plus', statement.breakdown.extendedLicenses, statement.breakdown.extendedUSD.toFixed(2)],
      [],
      ['Total Licenses Sold', statement.totalLicensesSold],
      ['Gross Customer Billings', `$${statement.grossBillingsUSD.toFixed(2)}`],
      ['US Withholding Tax (W-8BEN)', `$${statement.taxWithheldUSD.toFixed(2)}`],
      ['Total Net Royalty Payable (USD)', `$${statement.contributorNetUSD.toFixed(2)}`],
      ['Payment Status', statement.paymentStatus],
      ['Payout Destination', statement.payoutMethod],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${statement.statementNumber}_Royalty_Statement.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0f141f] border border-slate-800 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Top Modal Controls */}
        <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-100">Official Contributor Royalty Statement</span>
            <span className="text-slate-500">·</span>
            <span className="font-mono text-cyan-400">{statement.statementNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Statement Document */}
        <div className="p-8 overflow-y-auto bg-white text-slate-900 selection:bg-cyan-100 font-sans" id="printable-royalty-statement">
          {/* Header with Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6 mb-6">
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-950 font-serif">
                gettyimages <span className="font-sans font-light text-slate-400 text-lg">| iStock</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Getty Images International · Contributor Financial Operations
              </div>
              <div className="text-xs text-slate-500">
                Enterprise Submissions Platform (ESP) · 605 5th Ave S, Seattle, WA 98104
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-slate-950">ROYALTY STATEMENT</div>
              <div className="text-xs font-mono text-slate-600 mt-1">REF: {statement.statementNumber}</div>
              <div className="text-xs text-slate-600">Period: <strong className="text-slate-900">{statement.periodMonth}</strong></div>
              <div className="text-xs text-slate-600">Disbursement Date: {statement.payoutDate}</div>
            </div>
          </div>

          {/* Contributor Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contributor</div>
              <div className="font-semibold text-slate-900 mt-0.5">{profile.name}</div>
              <div className="text-slate-500 text-[11px] font-mono">{profile.id}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Studio / Entity</div>
              <div className="font-semibold text-slate-900 mt-0.5">{profile.studioName}</div>
              <div className="text-slate-500 text-[11px]">{profile.email}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contract Tier</div>
              <div className="font-semibold text-slate-900 mt-0.5">{profile.tier} Signature</div>
              <div className="text-slate-500 text-[11px]">{profile.royaltyRate}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tax & Withholding</div>
              <div className="font-semibold text-slate-900 mt-0.5">{profile.taxStatus}</div>
              <div className="text-slate-500 text-[11px]">US Treaty Rate: {profile.withholdingRate}%</div>
            </div>
          </div>

          {/* Collection Channel Breakdown Table */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Royalty Licensing Activity by Distribution Channel
            </h4>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-600">
                  <th className="py-2 font-semibold">Distribution Channel</th>
                  <th className="py-2 font-semibold">License Model</th>
                  <th className="py-2 text-right font-semibold">Volume (Units)</th>
                  <th className="py-2 text-right font-semibold">Share Rate</th>
                  <th className="py-2 text-right font-semibold">Net Contributor Royalty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                <tr>
                  <td className="py-2.5 font-sans font-medium text-slate-900">iStock Signature Collection</td>
                  <td className="py-2.5 font-sans text-slate-600">Exclusive Royalty-Free</td>
                  <td className="py-2.5 text-right tabular-nums">{statement.breakdown.istockSignatureLicenses}</td>
                  <td className="py-2.5 text-right text-slate-600">40.0%</td>
                  <td className="py-2.5 text-right font-semibold text-slate-950 tabular-nums">
                    ${statement.breakdown.istockSignatureUSD.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-slate-900">iStock Essentials Tier</td>
                  <td className="py-2.5 font-sans text-slate-600">Standard Subscription</td>
                  <td className="py-2.5 text-right tabular-nums">{statement.breakdown.istockEssentialsLicenses}</td>
                  <td className="py-2.5 text-right text-slate-600">25.0%</td>
                  <td className="py-2.5 text-right font-semibold text-slate-950 tabular-nums">
                    ${statement.breakdown.istockEssentialsUSD.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-slate-900">Getty Images Creative Plus</td>
                  <td className="py-2.5 font-sans text-slate-600">High-Resolution Enterprise RF</td>
                  <td className="py-2.5 text-right tabular-nums">{statement.breakdown.gettyCreativeLicenses}</td>
                  <td className="py-2.5 text-right text-slate-600">45.0%</td>
                  <td className="py-2.5 text-right font-semibold text-slate-950 tabular-nums">
                    ${statement.breakdown.gettyCreativeUSD.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-slate-900">Extended Commercial Licenses</td>
                  <td className="py-2.5 font-sans text-slate-600">Packaging / Print Resale</td>
                  <td className="py-2.5 text-right tabular-nums">{statement.breakdown.extendedLicenses}</td>
                  <td className="py-2.5 text-right text-slate-600">40.0%</td>
                  <td className="py-2.5 text-right font-semibold text-slate-950 tabular-nums">
                    ${statement.breakdown.extendedUSD.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Statement Financial Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-t-2 border-slate-900 pt-4 text-xs">
            <div className="max-w-xs space-y-1 text-slate-600 text-[11px] mb-4 sm:mb-0">
              <div className="font-semibold text-slate-800">Payment & Tax Compliance Notes</div>
              <div>Disbursed via: <strong className="text-slate-900">{statement.payoutMethod}</strong></div>
              <div>Status: <span className="font-semibold text-emerald-700">{statement.paymentStatus}</span></div>
              <div className="text-[10px] text-slate-500 pt-1">
                Payments are made in accordance with Getty Images Contributor Content License Agreement. Threshold $100.00 USD.
              </div>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-right">
              <div className="flex justify-between text-slate-600">
                <span>Gross Customer Billings:</span>
                <span className="font-mono tabular-nums">${statement.grossBillingsUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>US Tax Withholding (W-8BEN):</span>
                <span className="font-mono tabular-nums">-${statement.taxWithheldUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-950 border-t border-slate-300 pt-2">
                <span>Net Royalty Payable:</span>
                <span className="font-mono text-emerald-700 tabular-nums">${statement.contributorNetUSD.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
