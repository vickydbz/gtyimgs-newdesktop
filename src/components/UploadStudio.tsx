import React, { useState, useRef } from 'react';
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Tag, 
  FileText, 
  Camera, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  Trash2, 
  Eye, 
  Plus, 
  Sliders,
  Check
} from 'lucide-react';
import { StockAsset, AssetCategory, ContributorProfile } from '../types';
import { apiService } from '../services/apiService';

interface UploadStudioProps {
  assets: StockAsset[];
  onAddAsset: (asset: StockAsset) => void;
  onUpdateAsset: (asset: StockAsset) => void;
  onDeleteAsset: (id: string) => void;
  profile: ContributorProfile;
}

export const UploadStudio: React.FC<UploadStudioProps> = ({
  assets,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  profile,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file, index) => {
      const url = URL.createObjectURL(file);
      const newAsset: StockAsset = {
        id: `upload-${Date.now()}-${index}`,
        gettyId: `PENDING-ESP-${Math.floor(100000 + Math.random() * 900000)}`,
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        description: 'Commercial stock photography submitted for Getty Images & iStock licensing.',
        category: 'Modern Lifestyle',
        thumbnailUrl: url,
        uploadDate: new Date().toISOString().split('T')[0],
        resolution: '8192 x 5464 (44.8 MP)',
        aspectRatio: '3:2 Landscape',
        fileSizeMB: parseFloat((file.size / (1024 * 1024)).toFixed(1)) || 18.4,
        camera: 'Canon EOS R5',
        lens: 'RF 24-70mm F2.8L IS USM',
        iso: 100,
        shutter: '1/250s',
        aperture: 'f/4.0',
        colorSpace: 'Adobe RGB',
        licenseType: 'Creative RF',
        collection: profile.tier === 'Exclusive' ? 'iStock Signature' : 'iStock Essentials',
        modelRelease: 'Signed & Verified',
        propertyRelease: 'Not Required',
        keywords: ['Lifestyle', 'Contemporary', 'High Resolution', 'Commercial'],
        disambiguatedKeywords: [
          { tag: 'Lifestyle', disambiguation: 'Way of Life - Modern Living' },
          { tag: 'Commercial', disambiguation: 'Advertising Media' },
        ],
        status: 'draft',
        totalQuantitySold: 0,
        grossSalesUSD: 0,
        netRoyaltyUSD: 0,
        averageRoyaltyPerDownload: 0,
        lastLicensedDate: '—',
        topBuyerCountries: [],
      };
      onAddAsset(newAsset);
      setSelectedAssetId(newAsset.id);
    });
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordInput.trim() || !selectedAsset) return;
    const tag = newKeywordInput.trim();
    if (selectedAsset.keywords.includes(tag)) return;

    const updatedKeywords = [...selectedAsset.keywords, tag];
    const updatedDisambiguated = [
      ...selectedAsset.disambiguatedKeywords,
      { tag, disambiguation: `${tag} - Controlled Vocabulary` }
    ];

    onUpdateAsset({
      ...selectedAsset,
      keywords: updatedKeywords,
      disambiguatedKeywords: updatedDisambiguated,
    });
    setNewKeywordInput('');
  };

  const handleRemoveKeyword = (tagToRemove: string) => {
    if (!selectedAsset) return;
    onUpdateAsset({
      ...selectedAsset,
      keywords: selectedAsset.keywords.filter(k => k !== tagToRemove),
      disambiguatedKeywords: selectedAsset.disambiguatedKeywords.filter(d => d.tag !== tagToRemove),
    });
  };

  const handleAiKeywords = async () => {
    if (!selectedAsset) return;
    setIsGeneratingKeywords(true);
    try {
      const result = await apiService.getKeywordIntelligence({
        title: selectedAsset.title,
        description: selectedAsset.description,
        category: selectedAsset.category,
      });

      if (result?.topKeywords) {
        const newTags = result.topKeywords.map((k: { keyword: string }) => k.keyword);
        const mergedKeywords = Array.from(new Set([...selectedAsset.keywords, ...newTags]));
        const mergedDisambiguated = [
          ...selectedAsset.disambiguatedKeywords,
          ...result.topKeywords.map((k: { keyword: string; disambiguation: string }) => ({
            tag: k.keyword,
            disambiguation: k.disambiguation || `${k.keyword} - Concept`,
          })),
        ].filter((item, idx, self) => idx === self.findIndex(t => t.tag === item.tag));

        onUpdateAsset({
          ...selectedAsset,
          keywords: mergedKeywords,
          disambiguatedKeywords: mergedDisambiguated,
          title: result.suggestedTitle || selectedAsset.title,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const handleSubmitBatch = () => {
    setIsSubmittingBatch(true);
    setTimeout(() => {
      setIsSubmittingBatch(false);
      // Mark current selected asset as in_review or approved
      if (selectedAsset) {
        onUpdateAsset({
          ...selectedAsset,
          status: 'in_review',
        });
      }
      setSubmissionSuccess('Batch successfully transmitted to Getty Images ESP Ingestion Pipeline! Status: In Technical Review.');
      setTimeout(() => setSubmissionSuccess(null), 4000);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f17] overflow-hidden text-slate-200">
      {/* Top Banner / Stats */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#0e1420]/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Photo Submission & ESP Uploader Studio</span>
            <span className="text-[11px] font-normal text-slate-400">·</span>
            <span className="text-[11px] font-normal text-cyan-400 font-mono">ESP v3.4 API Bridge</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit commercial creative, editorial documentary, and video assets directly to Getty Images & iStock
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors border border-slate-700"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Local Images</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/tiff"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={handleSubmitBatch}
            disabled={isSubmittingBatch}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmittingBatch ? 'Submitting to ESP...' : 'Submit Batch to Getty'}</span>
          </button>
        </div>
      </div>

      {submissionSuccess && (
        <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{submissionSuccess}</span>
          </div>
          <button onClick={() => setSubmissionSuccess(null)} className="text-emerald-400 hover:text-emerald-200">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Split Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Upload Zone & Asset Queue List */}
        <div className="w-80 md:w-96 border-r border-slate-800 flex flex-col bg-[#0c111a] shrink-0 overflow-hidden">
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`m-4 p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center ${
              isDragging 
                ? 'border-cyan-400 bg-cyan-950/20' 
                : 'border-slate-700/80 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-900/80'
            }`}
          >
            <Upload className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
            <div className="text-xs font-medium text-slate-200">Drag & drop stock photos here</div>
            <div className="text-[11px] text-slate-400 mt-1">JPEG, TIFF up to 100MB (Min. 3MP required)</div>
            <div className="text-[10px] text-slate-500 mt-2">Automatic EXIF metadata extraction</div>
          </div>

          {/* Queue List Header */}
          <div className="px-4 py-2 border-y border-slate-800 bg-slate-900/50 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Asset Queue ({assets.length})</span>
            <span className="text-[11px] text-cyan-400">Click to inspect</span>
          </div>

          {/* Queue List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {assets.map((asset) => {
              const isSelected = asset.id === selectedAssetId;
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-800/80 border-l-2 border-cyan-400' : 'hover:bg-slate-900/40'
                  }`}
                >
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-slate-900 shrink-0 border border-slate-800 relative">
                    <img
                      src={asset.thumbnailUrl}
                      alt={asset.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {asset.status === 'approved' && (
                      <span className="absolute bottom-0 right-0 bg-emerald-500 text-black p-0.5 rounded-tl-sm text-[8px] font-bold">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-200 truncate">{asset.title}</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                      <span className="font-mono text-cyan-400/90">{asset.gettyId}</span>
                      <span>·</span>
                      <span>{asset.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] mt-1">
                      <span className={`px-1.5 py-0.2 rounded font-mono ${
                        asset.status === 'approved' 
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' 
                          : asset.status === 'in_review'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {asset.status.toUpperCase()}
                      </span>
                      {asset.totalQuantitySold > 0 && (
                        <span className="text-slate-400 tabular-nums">
                          {asset.totalQuantitySold} sold
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Metadata, Disambiguation & Release Inspector */}
        {selectedAsset ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Top Preview Card */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 bg-slate-900/40 border border-slate-800 rounded-xl p-5">
              {/* Image Preview with High-Res Frame */}
              <div className="xl:col-span-1 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 relative group">
                <img
                  src={selectedAsset.thumbnailUrl}
                  alt={selectedAsset.title}
                  className="w-full h-56 xl:h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-mono text-cyan-300 border border-white/10">
                  {selectedAsset.resolution}
                </div>
                <div className="absolute bottom-2 left-2 right-2 px-2 py-1.5 rounded bg-black/80 backdrop-blur-xs text-[10px] text-slate-300 border border-white/10 flex items-center justify-between">
                  <span>{selectedAsset.aspectRatio}</span>
                  <span className="font-mono text-amber-300">{selectedAsset.fileSizeMB} MB</span>
                </div>
              </div>

              {/* Technical EXIF & Camera Telemetry */}
              <div className="xl:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-100">Camera & Optical EXIF Telemetry</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Color Space: <span className="text-emerald-400">{selectedAsset.colorSpace}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Camera Body</div>
                    <div className="text-xs font-medium text-slate-200 truncate">{selectedAsset.camera}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Lens Optics</div>
                    <div className="text-xs font-medium text-slate-200 truncate">{selectedAsset.lens}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Shutter / Aperture</div>
                    <div className="text-xs font-medium text-slate-200 font-mono">
                      {selectedAsset.shutter} · {selectedAsset.aperture}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">ISO Speed</div>
                    <div className="text-xs font-medium text-slate-200 font-mono">{selectedAsset.iso}</div>
                  </div>
                </div>

                {/* Editorial vs Commercial Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">License Type</label>
                    <select
                      value={selectedAsset.licenseType}
                      onChange={(e) => onUpdateAsset({
                        ...selectedAsset,
                        licenseType: e.target.value as StockAsset['licenseType']
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-400"
                    >
                      <option value="Creative RF">Creative Royalty-Free (Commercial)</option>
                      <option value="Editorial">Editorial Documentary (News/Press)</option>
                      <option value="Extended Commercial">Extended Commercial (Packaging/Resale)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Collection Channel</label>
                    <select
                      value={selectedAsset.collection}
                      onChange={(e) => onUpdateAsset({
                        ...selectedAsset,
                        collection: e.target.value as StockAsset['collection']
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-400"
                    >
                      <option value="iStock Signature">iStock Signature (Exclusive)</option>
                      <option value="iStock Essentials">iStock Essentials (Standard)</option>
                      <option value="Getty Images Creative">Getty Images Creative Plus</option>
                      <option value="Getty Editorial">Getty Editorial Press</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Asset Category</label>
                    <select
                      value={selectedAsset.category}
                      onChange={(e) => onUpdateAsset({
                        ...selectedAsset,
                        category: e.target.value as AssetCategory
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-400"
                    >
                      <option value="Sustainable Energy">Sustainable Energy</option>
                      <option value="Technology & AI">Technology & AI</option>
                      <option value="Healthcare & Medicine">Healthcare & Medicine</option>
                      <option value="Business & Finance">Business & Finance</option>
                      <option value="Travel & Nature">Travel & Nature</option>
                      <option value="Modern Lifestyle">Modern Lifestyle</option>
                      <option value="Industrial & Architecture">Industrial & Architecture</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Fields: Title & Description */}
            <div className="space-y-4 bg-slate-900/40 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Title, Caption & Commercial Description</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Getty Rule: Must describe subject, action, location without keyword stuffing
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Asset Title (Commercial Search Headline)</label>
                <input
                  type="text"
                  value={selectedAsset.title}
                  onChange={(e) => onUpdateAsset({ ...selectedAsset, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Detailed Caption & Scene Description</label>
                <textarea
                  value={selectedAsset.description}
                  rows={2}
                  onChange={(e) => onUpdateAsset({ ...selectedAsset, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              {/* Releases Verification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Model Release</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {selectedAsset.modelRelease}
                    </span>
                  </div>
                  <select
                    value={selectedAsset.modelRelease}
                    onChange={(e) => onUpdateAsset({
                      ...selectedAsset,
                      modelRelease: e.target.value as StockAsset['modelRelease']
                    })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-hidden focus:border-cyan-400"
                  >
                    <option value="Signed & Verified">Signed & Verified (Adult/Minor Release On File)</option>
                    <option value="Not Required (No Faces)">Not Required (No Recognizable Faces)</option>
                    <option value="Pending">Pending (Signature Required)</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Property Release</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {selectedAsset.propertyRelease}
                    </span>
                  </div>
                  <select
                    value={selectedAsset.propertyRelease}
                    onChange={(e) => onUpdateAsset({
                      ...selectedAsset,
                      propertyRelease: e.target.value as StockAsset['propertyRelease']
                    })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-hidden focus:border-cyan-400"
                  >
                    <option value="Signed & Verified">Signed & Verified (Private Property Authorized)</option>
                    <option value="Not Required">Not Required (Public Space / Generic Architecture)</option>
                    <option value="Pending">Pending (Property Release Required)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Controlled Vocabulary & Disambiguation Engine */}
            <div className="space-y-4 bg-slate-900/40 border border-slate-800 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <span>Getty Controlled Vocabulary & Disambiguated Keywords ({selectedAsset.keywords.length})</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Disambiguated keywords translate into 20+ languages across global Getty search engines
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAiKeywords}
                  disabled={isGeneratingKeywords}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingKeywords ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingKeywords ? 'Analyzing Vocabulary...' : 'AI Expand & Disambiguate'}</span>
                </button>
              </div>

              {/* Tag Input */}
              <form onSubmit={handleAddKeyword} className="flex gap-2">
                <input
                  type="text"
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  placeholder="Type new keyword and press enter (e.g. Remote Work, Solar Panel)..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tag</span>
                </button>
              </form>

              {/* Keywords Tag Cloud with Disambiguation Context */}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedAsset.disambiguatedKeywords.map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs text-slate-200 hover:border-cyan-500/60 transition-colors"
                  >
                    <span className="font-medium text-slate-100">{item.tag}</span>
                    <span className="text-[10px] text-slate-500 group-hover:text-cyan-400">
                      ({item.disambiguation.split('-')[0].trim()})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(item.tag)}
                      className="ml-1 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove keyword"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
            No assets in queue. Drag & drop photos to begin.
          </div>
        )}
      </div>
    </div>
  );
};
