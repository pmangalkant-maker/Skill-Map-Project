import React, { useState } from 'react';
import { Sparkles, Check, AlertCircle, Info, ShieldAlert, ArrowRight } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Input } from './Input';
import { Select } from './Select';
import { Textarea } from './Textarea';
import { Checkbox } from './Checkbox';
import { SearchInput } from './SearchInput';
import { ProgressBar } from './ProgressBar';
import { Spinner, Skeleton } from './LoadingState';
import { Alert } from './ErrorState';

export const FoundationGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'buttons' | 'badges' | 'forms' | 'feedback'>(
    'tokens'
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="UI/UX Foundation & Design System Specification"
      description="Interactive reference of the typography, color system, and reusable component library."
      maxWidth="xl"
      footer={
        <Button variant="primary" size="sm" onClick={onClose}>
          Close Guide
        </Button>
      }
    >
      <div className="space-y-5 text-xs sm:text-sm">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-1">
          {[
            { id: 'tokens', label: 'Color & Typography' },
            { id: 'buttons', label: 'Buttons' },
            { id: 'badges', label: 'Status Badges' },
            { id: 'forms', label: 'Form Controls' },
            { id: 'feedback', label: 'Feedback & Progress' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Tokens */}
        {activeTab === 'tokens' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Primary Color System (Blue / Indigo)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg bg-blue-600 text-white font-medium text-xs text-center">
                  Primary Blue
                  <div className="text-[10px] opacity-80 mt-0.5">#2563eb / blue-600</div>
                </div>
                <div className="p-2.5 rounded-lg bg-indigo-600 text-white font-medium text-xs text-center">
                  Deep Indigo
                  <div className="text-[10px] opacity-80 mt-0.5">#4f46e5 / indigo-600</div>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-medium text-xs text-center">
                  Light Surface
                  <div className="text-[10px] opacity-80 mt-0.5">blue-50 / indigo-50</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 font-medium text-xs text-center">
                  Canvas Neutral
                  <div className="text-[10px] opacity-80 mt-0.5">slate-50 / white</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Semantic State System</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium text-center">
                  Success State (Green)
                  <div className="text-[10px] opacity-80 mt-0.5">emerald-600 / 500</div>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium text-center">
                  Warning State (Amber)
                  <div className="text-[10px] opacity-80 mt-0.5">amber-600 / 500</div>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium text-center">
                  Error State (Red)
                  <div className="text-[10px] opacity-80 mt-0.5">rose-600 / 500</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Typography</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standardized on <span className="font-semibold text-slate-900">Inter</span> paired with crisp letter tracking, mathematical baseline rhythm (1.5-1.7 line height), and 12-16px card border radiuses.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Buttons */}
        {activeTab === 'buttons' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Button Variants &amp; Sizes</h4>
            <div className="flex flex-wrap gap-2.5 items-center">
              <Button variant="primary" size="md">Primary</Button>
              <Button variant="secondary" size="md">Secondary</Button>
              <Button variant="outline" size="md">Outline</Button>
              <Button variant="ghost" size="md">Ghost</Button>
              <Button variant="danger" size="md">Danger</Button>
            </div>

            <h4 className="font-semibold text-slate-900 pt-2">Sizes &amp; States</h4>
            <div className="flex flex-wrap gap-2.5 items-center">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" size="md" isLoading>Loading</Button>
              <Button variant="outline" size="md" disabled>Disabled</Button>
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                With Icon
              </Button>
            </div>
          </div>
        )}

        {/* Tab 3: Badges */}
        {activeTab === 'badges' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Status Badges</h4>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="primary">Primary (Blue)</Badge>
              <Badge variant="success">Success (Green)</Badge>
              <Badge variant="warning">Warning (Amber)</Badge>
              <Badge variant="danger">Error (Red)</Badge>
              <Badge variant="neutral">Neutral (Slate)</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>

            <h4 className="font-semibold text-slate-900 pt-2">Badges with Indicator Dots &amp; Sizes</h4>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="success" size="sm" dot>Verified</Badge>
              <Badge variant="warning" size="sm" dot>In Progress</Badge>
              <Badge variant="danger" size="sm" dot>Action Needed</Badge>
              <Badge variant="primary" size="sm">Small</Badge>
              <Badge variant="primary" size="md">Medium</Badge>
            </div>
          </div>
        )}

        {/* Tab 4: Forms */}
        {activeTab === 'forms' && (
          <div className="space-y-3">
            <Input label="Standard Input" placeholder="Type text here..." hint="Helper explanation text below input" />
            <Input label="Input with Error State" defaultValue="Invalid email" error="Please enter a valid academic email address" />
            <Select
              label="Select Dropdown"
              options={[
                { value: '1', label: 'Frontend Architecture' },
                { value: '2', label: 'Cloud Infrastructure' },
              ]}
            />
            <Checkbox
              label="Interactive Checkbox"
              description="Custom styled checkbox with accessible focus ring"
              defaultChecked
            />
          </div>
        )}

        {/* Tab 5: Feedback */}
        {activeTab === 'feedback' && (
          <div className="space-y-3">
            <Alert variant="info" title="Informational Notice" message="Application shell configured with full responsive drawer navigation." />
            <Alert variant="success" title="Success State" message="Green indicator variant conforming to UX requirements." />
            <Alert variant="warning" title="Warning State" message="Amber indicator variant for priority gap alerts." />
            <Alert variant="error" title="Error State" message="Red indicator variant for validation deficits." />

            <div className="pt-2 space-y-2">
              <span className="font-semibold text-slate-900 block text-xs">Linear Progress Bars</span>
              <ProgressBar value={85} variant="success" showValueText label="Competency Verification" />
              <ProgressBar value={45} variant="warning" showValueText label="Milestone Readiness" />
              <ProgressBar value={20} variant="danger" showValueText label="Deficit Severity" />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Loading Spinners:</span>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
