import { Loader2, Sparkles, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AnalysisSectionProps {
  isLoading: boolean;
  report: string;
  hasRecords: boolean;
  hasApiKey: boolean;
  onAnalyze: () => void;
}

export default function AnalysisSection({
  isLoading,
  report,
  hasRecords,
  hasApiKey,
  onAnalyze,
}: AnalysisSectionProps) {
  const hasContent = report.length > 0;
  const canAnalyze = hasRecords && !isLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-secondary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base">AI 消費分析</CardTitle>
              <CardDescription className="text-xs">
                根據你的收支資料，生成個人化的消費分析報告
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasApiKey && (
            <Alert variant="default" className="bg-warning/10 border-warning/30">
              <AlertCircle className="size-4 text-warning" />
              <AlertTitle className="text-sm font-medium text-foreground">尚未設定 API Key</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                請先在上方設定你的 AI API Key，以便進行分析。
              </AlertDescription>
            </Alert>
          )}

          {!hasRecords && (
            <Alert variant="default" className="bg-muted/50 border-border/40">
              <FileText className="size-4 text-muted-foreground" />
              <AlertTitle className="text-sm font-medium text-foreground">尚無支出紀錄</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                請先新增至少一筆支出紀錄，再進行 AI 分析。
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={onAnalyze}
            disabled={!canAnalyze}
            size="lg"
            className="w-full text-base h-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                AI 分析中，請稍候...
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" />
                開始分析
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {(isLoading || hasContent) && (
        <Card className="border-border/50 overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <CardTitle className="text-base">消費分析報告</CardTitle>
              {isLoading && (
                <Loader2 className="size-3.5 text-muted-foreground animate-spin ml-auto" />
              )}
            </div>
          </CardHeader>
          <CardContent className="p-5">
            {isLoading && !hasContent && (
              <div className="space-y-3 py-8">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="size-5 animate-spin text-primary" />
                  <span className="text-sm">AI 正在分析你的消費數據...</span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded-full w-3/4 animate-pulse" />
                  <div className="h-3 bg-muted rounded-full w-1/2 animate-pulse" />
                  <div className="h-3 bg-muted rounded-full w-5/6 animate-pulse" />
                </div>
              </div>
            )}

            {hasContent && (
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-headings:font-semibold prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2 prose-p:text-sm prose-p:leading-relaxed prose-p:my-2 prose-li:text-sm prose-li:leading-relaxed prose-ul:my-2 prose-ol:my-2 prose-strong:text-primary prose-strong:font-semibold">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
              </div>
            )}

            {isLoading && hasContent && (
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/30 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                <span>繼續生成中...</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isLoading && !hasContent && hasRecords && hasApiKey && (
        <Card className="border-dashed border-border/50 bg-background/50">
          <CardContent className="p-8 text-center space-y-3">
            <div className="mx-auto size-12 rounded-full bg-muted/50 flex items-center justify-center">
              <Sparkles className="size-6 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium text-foreground">準備好了嗎？</div>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
              點擊上方「開始分析」按鈕，AI 將為你生成個人化的消費分析報告，包含花費占比、省錢建議與預算規劃。
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
