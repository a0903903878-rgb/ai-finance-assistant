import { useState } from 'react';
import { Key, Eye, EyeOff, Check, Info, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

interface ApiKeySectionProps {
  apiKey: string;
  onSave: (key: string) => void;
}

export default function ApiKeySection({ apiKey, onSave }: ApiKeySectionProps) {
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(apiKey.length > 0);

  const handleSave = () => {
    onSave(inputValue.trim());
    setIsSaved(inputValue.trim().length > 0);
    toast.success(inputValue.trim() ? 'API Key 已儲存' : 'API Key 已清除');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Key className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base">AI API Key 設定</CardTitle>
              <CardDescription className="text-xs">
                Key 僅儲存於你的瀏覽器，不會上傳至任何伺服器
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showKey ? 'text' : 'password'}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsSaved(false);
                }}
                placeholder="輸入你的 AI API Key（如 Gemini / OpenAI）"
                className="pr-10 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showKey ? '隱藏金鑰' : '顯示金鑰'}
              >
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <Button onClick={handleSave} className="shrink-0">
              {isSaved ? (
                <>
                  <Check className="size-4 mr-1" />
                  已儲存
                </>
              ) : (
                '儲存'
              )}
            </Button>
          </div>

          {!apiKey && (
            <div className="flex gap-3 p-3 rounded-lg bg-muted/60 border border-border/40">
              <Info className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                <p className="font-medium text-foreground">還沒有 API Key？</p>
                <p>你可以申請免費的 AI API Key 來使用分析功能。常用選項：</p>
                <ul className="space-y-1 pl-4 list-disc">
                  <li>
                    <span className="font-medium">Google Gemini API</span>：提供免費額度，適合初學者練習
                  </li>
                  <li>
                    <span className="font-medium">OpenAI API</span>：功能強大，需付費使用
                  </li>
                </ul>
                <p className="flex items-center gap-1">
                  <ExternalLink className="size-3" />
                  申請後將 Key 貼上並儲存即可開始使用
                </p>
              </div>
            </div>
          )}

          {apiKey && (
            <div className="flex items-center gap-2 text-xs text-success">
              <Check className="size-3.5" />
              <span>API Key 已設定完成，可以開始分析</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
