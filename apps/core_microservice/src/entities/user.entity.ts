import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Profile } from './profile.entity';
import { Asset } from './asset.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import { ChatParticipant } from './many-to-many/chat-participants.entity';
import { CommentLike } from './many-to-many/comment-like.entity';
import { PostLike } from './many-to-many/post-like.entity';
import { Notification } from './notification.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: string;

  @Column({ nullable: true })
  lastOnlineAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Account, (account) => account.user)
  account: Account;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Post, (post) => post.author, {
    onDelete: 'CASCADE',
  })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @OneToMany(() => Chat, (chat) => chat.creator, {
    onDelete: 'CASCADE',
  })
  createdChats: Chat[];

  @OneToMany(() => Message, (message) => message.sender, {
    onDelete: 'CASCADE',
  })
  messages: Message[];

  @OneToMany(() => PostLike, (postLike) => postLike.user, {
    onDelete: 'CASCADE',
  })
  postLikes: PostLike[];

  @OneToMany(() => CommentLike, (commentLike) => commentLike.user, {
    onDelete: 'CASCADE',
  })
  commentLikes: CommentLike[];

  @OneToMany(() => ChatParticipant, (chatParticipant) => chatParticipant.user, {
    onDelete: 'CASCADE',
  })
  chatParticipants: ChatParticipant[];

  @OneToMany(() => Notification, (notification) => notification.recipient, {
    onDelete: 'CASCADE',
  })
  receivedNotifications: Notification[];

  @OneToMany(() => Notification, (notification) => notification.sender, {
    onDelete: 'CASCADE',
  })
  sentNotifications: Notification[];

  @OneToMany(() => Asset, (asset) => asset.uploader, {
    onDelete: 'CASCADE',
  })
  uploadedAssets: Asset[];
}
