import { describe, it, expect, beforeEach, vi } from "vitest";

import { ConversationService } from "@/features/ai/services/conversation-service";
import type { AIConversation } from "@/features/ai/types";

const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockResolvedValue([]),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockResolvedValue([]),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
};

describe("ConversationService", () => {
  let service: ConversationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ConversationService(mockDb as never);
  });

  describe("createNewConversation", () => {
    it("should create a new conversation with first message", () => {
      const conversation = service.createNewConversation("Can I bunk?");

      expect(conversation.id).toBeTruthy();
      expect(conversation.title).toBe("Can I bunk?");
      expect(conversation.messages).toHaveLength(1);
      expect(conversation.messages[0].content).toBe("Can I bunk?");
      expect(conversation.messages[0].role).toBe("user");
      expect(conversation.isPinned).toBe(false);
      expect(conversation.messageCount).toBe(1);
    });

    it("should truncate long titles", () => {
      const longMessage = "A".repeat(100);
      const conversation = service.createNewConversation(longMessage);

      expect(conversation.title).toHaveLength(53);
      expect(conversation.title).toContain("...");
    });
  });

  describe("getAllConversations", () => {
    it("should return empty array when no conversations", async () => {
      mockDb.orderBy.mockResolvedValue([]);

      const conversations = await service.getAllConversations();

      expect(conversations).toEqual([]);
    });
  });

  describe("getConversation", () => {
    it("should return null when not found", async () => {
      mockDb.limit.mockResolvedValue([]);

      const conversation = await service.getConversation("nonexistent");

      expect(conversation).toBeNull();
    });

    it("should parse and return conversation", async () => {
      const mockConversation: AIConversation = {
        id: "test-id",
        title: "Test",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPinned: false,
        messageCount: 0,
      };

      mockDb.limit.mockResolvedValue([{ value: JSON.stringify(mockConversation) }]);

      const conversation = await service.getConversation("test-id");

      expect(conversation).toEqual(mockConversation);
    });
  });

  describe("deleteConversation", () => {
    it("should delete conversation", async () => {
      await service.deleteConversation("test-id");

      expect(mockDb.delete).toHaveBeenCalled();
    });
  });

  describe("togglePin", () => {
    it("should toggle pin status", async () => {
      const mockConversation: AIConversation = {
        id: "test-id",
        title: "Test",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPinned: false,
        messageCount: 0,
      };

      mockDb.limit.mockResolvedValue([{ value: JSON.stringify(mockConversation) }]);

      await service.togglePin("test-id");

      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe("clearAllConversations", () => {
    it("should delete all conversations", async () => {
      await service.clearAllConversations();

      expect(mockDb.delete).toHaveBeenCalled();
    });
  });
});
