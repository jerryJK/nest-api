import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../user.entity';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<UserEntity> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return UserEntity;
  }

  /**
   * Called before post insertion.
   * Hash user password
   */

  async beforeInsert(event: InsertEvent<UserEntity>) {
    const costFactor = 12;
    event.entity.password = await bcrypt.hash(
      event.entity.password,
      costFactor,
    );
  }
}
