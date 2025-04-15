
import {ChatWidget} from '@/components/ChatWidget';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-primary mb-8">Talk Me</h1>
        <p className="text-lg text-foreground mb-4">
          Ask me anything about my skills and projects!
        </p>
      </main>
      <ChatWidget/>
    </div>
  );
}
