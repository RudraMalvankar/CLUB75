import { and, eq, desc } from "drizzle-orm";

import { createId, toRepositoryError, touchTimestamps, updatedTimestamp } from "@/database/helpers";
import { aiMetadata } from "@/database/schema/aiMetadata";
import type { Club75Database } from "@/database/types";
import type { AIConversation, AIMessage } from "@/features/ai/types";

const CONVERSATION_NAMESPACE = "conversation";
const MAX_CONVERSATIONS = 50;

export class ConversationService {
  constructor(private readonly db: Club75Database) {}

  async getAllConversations(): Promise<AIConversation[]> {
    try {
      const rows = await this.db
        .select()
        .from(aiMetadata)
        .where(eq(aiMetadata.namespace, CONVERSATION_NAMESPACE))
        .orderBy(desc(aiMetadata.updatedAt));

      const conversationMap = new Map<string, AIConversation>();

      for (const row of rows) {
        const data = JSON.parse(row.value) as AIConversation;
        const key = row.key;

        if (!conversationMap.has(key)) {
          conversationMap.set(key, data);
        }
      }

      return Array.from(conversationMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      throw toRepositoryError(error, "Failed to load conversations");
    }
  }

  async getConversation(id: string): Promise<AIConversation | null> {
    try {
      const [row] = await this.db
        .select()
        .from(aiMetadata)
        .where(and(eq(aiMetadata.namespace, CONVERSATION_NAMESPACE), eq(aiMetadata.key, id)))
        .limit(1);

      if (!row) return null;
      return JSON.parse(row.value) as AIConversation;
    } catch (error) {
      throw toRepositoryError(error, "Failed to load conversation");
    }
  }

  async saveConversation(conversation: AIConversation): Promise<void> {
    try {
      const [existing] = await this.db
        .select()
        .from(aiMetadata)
        .where(
          and(
            eq(aiMetadata.namespace, CONVERSATION_NAMESPACE),
            eq(aiMetadata.key, conversation.id),
          ),
        )
        .limit(1);

      if (existing) {
        await this.db
          .update(aiMetadata)
          .set({
            value: JSON.stringify(conversation),
            ...updatedTimestamp(),
          })
          .where(eq(aiMetadata.id, existing.id));
      } else {
        await this.db.insert(aiMetadata).values({
          id: createId(),
          namespace: CONVERSATION_NAMESPACE,
          key: conversation.id,
          value: JSON.stringify(conversation),
          ...touchTimestamps(),
        });
      }

      await this.cleanupOldConversations();
    } catch (error) {
      throw toRepositoryError(error, "Failed to save conversation");
    }
  }

  async addMessage(conversationId: string, message: AIMessage): Promise<void> {
    try {
      const conversation = await this.getConversation(conversationId);
      if (!conversation) return;

      const updated: AIConversation = {
        ...conversation,
        messages: [...conversation.messages, message],
        updatedAt: Date.now(),
        messageCount: conversation.messageCount + 1,
      };

      await this.saveConversation(updated);
    } catch (error) {
      throw toRepositoryError(error, "Failed to add message");
    }
  }

  async deleteConversation(id: string): Promise<void> {
    try {
      await this.db
        .delete(aiMetadata)
        .where(and(eq(aiMetadata.namespace, CONVERSATION_NAMESPACE), eq(aiMetadata.key, id)));
    } catch (error) {
      throw toRepositoryError(error, "Failed to delete conversation");
    }
  }

  async togglePin(id: string): Promise<void> {
    try {
      const conversation = await this.getConversation(id);
      if (!conversation) return;

      const updated: AIConversation = {
        ...conversation,
        isPinned: !conversation.isPinned,
        updatedAt: Date.now(),
      };

      await this.saveConversation(updated);
    } catch (error) {
      throw toRepositoryError(error, "Failed to toggle pin");
    }
  }

  async clearAllConversations(): Promise<void> {
    try {
      await this.db.delete(aiMetadata).where(eq(aiMetadata.namespace, CONVERSATION_NAMESPACE));
    } catch (error) {
      throw toRepositoryError(error, "Failed to clear conversations");
    }
  }

  private async cleanupOldConversations(): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      const unpinned = conversations.filter((c) => !c.isPinned);

      if (unpinned.length > MAX_CONVERSATIONS) {
        const toDelete = unpinned.slice(MAX_CONVERSATIONS);
        for (const c of toDelete) {
          await this.deleteConversation(c.id);
        }
      }
    } catch {
      // Silent cleanup failure
    }
  }

  createNewConversation(firstMessage: string): AIConversation {
    const now = Date.now();
    const message: AIMessage = {
      id: createId(),
      role: "user",
      content: firstMessage,
      timestamp: now,
    };

    return {
      id: createId(),
      title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : ""),
      messages: [message],
      createdAt: now,
      updatedAt: now,
      isPinned: false,
      messageCount: 1,
    };
  }
}
