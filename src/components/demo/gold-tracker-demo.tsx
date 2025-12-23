import { GoldTracker } from '@/components/gold/gold-tracker';

export function GoldTrackerDemo() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Default Gold Tracker</h2>
        <div className="bg-card max-w-xl rounded-lg border p-6">
          <GoldTracker />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">With Coins Enabled</h2>
        <div className="bg-card max-w-xl rounded-lg border p-6">
          <GoldTracker showCoinsInitially={true} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">With Initial Values</h2>
        <div className="bg-card max-w-xl rounded-lg border p-6">
          <GoldTracker
            initialChests={2}
            initialBags={5}
            initialHandfuls={3}
            initialCoins={7}
            showCoinsInitially={true}
            onChange={gold => console.log('Gold changed:', gold)}
          />
        </div>
      </section>
    </div>
  );
}
