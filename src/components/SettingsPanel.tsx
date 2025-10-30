import { Card } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { ScrollArea } from './ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Settings as SettingsType } from '../types/quran';
import { reciters } from '../data/quran-data';
import { Volume2, Type, Languages, Palette, User } from 'lucide-react';
import { Separator } from './ui/separator';

interface SettingsPanelProps {
  settings: SettingsType;
  onUpdateSettings: (settings: Partial<SettingsType>) => void;
}

export function SettingsPanel({ settings, onUpdateSettings }: SettingsPanelProps) {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="font-semibold text-xl">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Customize your reading experience
          </p>
        </div>

        <Card className="p-4 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Type className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Display Settings</h3>
            </div>
            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fontSize">Arabic Font Size</Label>
                  <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
                </div>
                <Slider
                  id="fontSize"
                  min={20}
                  max={48}
                  step={2}
                  value={[settings.fontSize]}
                  onValueChange={([value]) => onUpdateSettings({ fontSize: value })}
                />
                <p className="font-arabic text-center" style={{ fontSize: `${settings.fontSize}px` }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="translation">Show Translation</Label>
                  <p className="text-xs text-muted-foreground">
                    Display English translation below verses
                  </p>
                </div>
                <Switch
                  id="translation"
                  checked={settings.translationEnabled}
                  onCheckedChange={(checked) =>
                    onUpdateSettings({ translationEnabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="transliteration">Show Transliteration</Label>
                  <p className="text-xs text-muted-foreground">
                    Display romanized pronunciation
                  </p>
                </div>
                <Switch
                  id="transliteration"
                  checked={settings.transliterationEnabled}
                  onCheckedChange={(checked) =>
                    onUpdateSettings({ transliterationEnabled: checked })
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Audio Settings</h3>
            </div>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="reciter">Select Reciter</Label>
              <Select
                value={settings.reciter}
                onValueChange={(value) => onUpdateSettings({ reciter: value })}
              >
                <SelectTrigger id="reciter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reciters.map((reciter) => (
                    <SelectItem key={reciter.id} value={reciter.id}>
                      {reciter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Languages className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Language</h3>
            </div>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="language">Translation Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => onUpdateSettings({ language: value })}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="urdu">Urdu</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="turkish">Turkish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">About</h3>
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Surahs</span>
              <span className="font-medium">114</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Verses</span>
              <span className="font-medium">6,236</span>
            </div>
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
}
