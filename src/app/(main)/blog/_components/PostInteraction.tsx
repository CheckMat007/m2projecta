// src/app/(main)/blog/_components/PostInteraction.tsx
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { voteOnPostAction } from '../actions';
import { toast } from 'sonner';
import { VoteType } from '@prisma/client';

interface PostInteractionProps {
  postId: string;
  initialLikes: number;
  initialDislikes: number;
  userVote?: VoteType | null;
}

export function PostInteraction({ postId, initialLikes, initialDislikes, userVote }: PostInteractionProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [currentVote, setCurrentVote] = useState(userVote);
  const [isPending, startTransition] = useTransition();

  const handleVote = (voteType: VoteType) => {
    startTransition(async () => {
      let newLikes = likes;
      let newDislikes = dislikes;
      let newVote = currentVote;

      // --- LÓGICA CORRIGIDA COM IF/ELSE ---
      if (currentVote === voteType) { // Desfazendo o voto
        if (voteType === 'LIKE') {
          newLikes--;
        } else {
          newDislikes--;
        }
        newVote = null;
      } else { // Dando ou mudando o voto
        if (currentVote === 'LIKE') newLikes--;
        if (currentVote === 'DISLIKE') newDislikes--;
        
        if (voteType === 'LIKE') {
          newLikes++;
        } else {
          newDislikes++;
        }
        newVote = voteType;
      }
      setLikes(newLikes);
      setDislikes(newDislikes);
      setCurrentVote(newVote);
      
      // Chama a Server Action para salvar a mudança no banco
      const result = await voteOnPostAction({ postId, voteType });
      if (!result.success) {
        // Se a action falhar, reverte a UI para o estado inicial
        setLikes(initialLikes);
        setDislikes(initialDislikes);
        setCurrentVote(userVote);
        toast.error(result.message || "Ocorreu um erro ao registrar seu voto.");
      }
    });
  };

  return (
    <div className="flex items-center gap-4">
      <p className="font-semibold text-gray-300">Este artigo foi útil?</p>
      <div className="flex gap-2">
        <Button 
          variant={currentVote === 'LIKE' ? 'default' : 'outline'} 
          size="icon" 
          onClick={() => handleVote(VoteType.LIKE)}
          disabled={isPending}
          className={currentVote === 'LIKE' ? 'bg-m2-green text-black hover:bg-m2-green/80' : ''}
        >
          <ThumbsUp size={18} />
        </Button>
        <span className="w-8 text-center self-center">{likes}</span>
      </div>
      <div className="flex gap-2">
        <Button 
          variant={currentVote === 'DISLIKE' ? 'destructive' : 'outline'} 
          size="icon"
          onClick={() => handleVote(VoteType.DISLIKE)}
          disabled={isPending}
        >
          <ThumbsDown size={18} />
        </Button>
        <span className="w-8 text-center self-center">{dislikes}</span>
      </div>
    </div>
  );
}