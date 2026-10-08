import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { IndustryEvent } from '../types';

interface IndustryEventsCalendarProps {
  events: IndustryEvent[];
  onAddToQueue: (event: IndustryEvent) => void;
}

export const IndustryEventsCalendar: React.FC<IndustryEventsCalendarProps> = ({
  events,
  onAddToQueue,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (categoryFilter !== 'ALL' && e.category !== categoryFilter) return false;
      return true;
    });
  }, [events, categoryFilter]);

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];

  const handleQueueClick = (evt: IndustryEvent) => {
    onAddToQueue(evt);
    setNotificationStatus(`Added production target "${evt.title}" to Upload Pipeline!`);
    setTimeout(() => setNotificationStatus(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f17] overflow-hidden text-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#0e1420]/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Industry Events Calendar & Optimal Upload Windows</span>
            <span className="text-[11px] font-normal text-slate-400">·</span>
            <span className="text-[11px] font-normal text-amber-400 font-mono">2026 – 2027 Global Sync</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronize shoots with major global conferences, cultural milestones, and commercial shopping events
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          {(['ALL', 'Tech & Innovation', 'Commercial & Retail', 'Environment & Policy', 'Culture & Fashion'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded transition-colors ${
                categoryFilter === cat ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Events' : cat.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {notificationStatus && (
        <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notificationStatus}</span>
        </div>
      )}

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Events List & Golden Window Countdown */}
        <div className="w-96 border-r border-slate-800 flex flex-col bg-[#0c111a] shrink-0 overflow-y-auto divide-y divide-slate-800/60">
          <div className="p-3 bg-slate-900/40 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Upcoming Industry Milestones ({filteredEvents.length})</span>
            <span className="text-amber-400 font-mono">60-90 Day Window Highlighted</span>
          </div>

          {filteredEvents.map((evt) => {
            const isSelected = evt.id === selectedEventId;
            const isGolden = evt.windowStatus === 'Active Golden Window';

            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected ? 'bg-slate-800/80 border-l-2 border-cyan-400' : 'hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400 font-medium">{evt.category}</span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold border ${
                    isGolden 
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800/40 animate-pulse' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {isGolden ? `Golden Window (${evt.daysUntilWindowCloses}d left)` : evt.windowStatus}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-100 mt-1 line-clamp-1">{evt.title}</div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                  <CalendarIcon className="w-3 h-3 text-cyan-400" />
                  <span>Event: {evt.eventDate}</span>
                </div>

                {/* Optimal upload window highlight */}
                <div className="mt-2.5 p-2 rounded bg-slate-950/60 border border-slate-800/80 text-[10px]">
                  <div className="text-slate-500 font-mono">OPTIMAL UPLOAD WINDOW:</div>
                  <div className="font-semibold text-cyan-300 font-mono mt-0.5">
                    {evt.optimalUploadWindowStart} ➔ {evt.optimalUploadWindowEnd}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Event Deep Strategy & Shoot Planner */}
        {selectedEvent ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Spotlight Header Card */}
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <span>{selectedEvent.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{selectedEvent.location}</span>
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-100 mt-1">{selectedEvent.title}</h2>
                  <div className="text-xs text-slate-400 mt-1">
                    Event Scheduled: <strong className="text-slate-200">{selectedEvent.eventDate}</strong> {selectedEvent.eventEndDate ? `– ${selectedEvent.eventEndDate}` : ''}
                  </div>
                </div>

                <button
                  onClick={() => handleQueueClick(selectedEvent)}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Target to Upload Queue</span>
                </button>
              </div>

              {/* Window Status Banner */}
              <div className="p-4 bg-amber-950/20 border border-amber-600/30 rounded-lg flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-300">
                    Recommended Optimal Upload Window: {selectedEvent.optimalUploadWindowStart} to {selectedEvent.optimalUploadWindowEnd}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>

              {/* Visual Shoot Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Commercial Shoot Checklist for this Event</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {selectedEvent.visualChecklist.map((item, i) => (
                      <li key={i} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-start gap-2.5">
                        <span className="text-cyan-400 font-mono text-xs font-bold mt-0.5">#{i + 1}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span>High-Index Keywords to Disambiguate</span>
                  </h3>
                  <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-3">
                    <div className="text-[11px] text-slate-400">
                      Include these controlled terms in your sidecar metadata to rank in event-specific buyer collections:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.recommendedKeywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
