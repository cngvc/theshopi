class ChatController {
  public async getBuyerByEmail(req: Request, res: Response): Promise<void> {
    // const response = await chatService.createConversation;
    // new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const chatController = new ChatController();
