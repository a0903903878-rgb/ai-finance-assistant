import { Wallet, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeaderSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center space-y-3"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
        <Sparkles className="size-4" />
        AI 智慧理財
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
        <span className="text-primary">AI</span> 理財小助手
      </h1>
      <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
        輸入你的每月收支，讓 AI 幫你分析消費習慣、找出浪費項目，並給出個人化的省錢建議與預算規劃。
      </p>
      <div className="flex items-center justify-center gap-3 pt-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wallet className="size-3.5" />
          <span>資料只存在你的瀏覽器</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
        <div className="text-xs text-muted-foreground">繁體中文介面</div>
      </div>
    </motion.div>
  );
}
